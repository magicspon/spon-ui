import sync from 'framesync'
import throttle from 'raf-throttle'
import domEvents from './domEvents'
import getRefs from './refs'
import store, { render } from '@/store'

function loader(context) {
	const cache = new Map()
	const killList = {}
	let handle

	const scan = () => {
		cache.forEach(async item => {
			const { query, name, node, hasLoaded, module, keepAlive, observer } = item
			// has the item already been loaded
			// and it no longer query object no longer passes
			if (hasLoaded) {
				// if the query no longer passes call the unmount method
				if (query && !window.matchMedia(query).matches) {
					// remove it from the kill list

					// call the module, it has already been called
					// once so this will be the returned function
					// that should remove any custom event handlers
					module()
					observer.disconnect()
					// update the cache
					cache.set(name, {
						...item,
						hasLoaded: false
					})
				}
				// quit the function
				return
			}
			// if there is a query and it matches, or if there is no query at all
			// and if we do not already have a module reference
			if (window.matchMedia(query).matches || typeof query === 'undefined') {
				// fetch the behaviour
				const resp = await import(/* webpackChunkName: "spon-[request]" */ `@/behaviours/${name}`)
				const { default: module } = resp
				// we might not have any refs... if we try and get some with none there...
				// the world will end
				// refs can be undefined
				let refs
				// a noop fallback
				let observer = () => {}
				const refNodes = [...node.querySelectorAll('[data-ref]')]
				if (refNodes.length) {
					const refOb = getRefs(node, refNodes)
					refs = refOb.refs
					observer = refOb.observer
				}

				// call it, and assign it to the cache
				// so that it can be called to unmoumt
				const destroyModule = module({ node, domEvents, store, render, refs })

				if (typeof query === 'undefined') {
					cache.delete(name)
				} else {
					cache.set(name, {
						...item,
						module: destroyModule,
						observer,
						hasLoaded: true
					})
				}

				if (!keepAlive) {
					killList[name] = { module: destroyModule, observer, name }
				}
			}
		})
	}

	function hydrate() {
		sync.read(() => {
			const nodes = [...context.querySelectorAll('*[data-spon]')]
			nodes
				.filter(
					({ dataset: { keepAlive, spon } }) =>
						keepAlive === 'true' || !cache.has(spon)
				)
				.forEach(node => {
					const { spon, query, keepAlive, ...rest } = node.dataset
					if (spon.split(' ').length > 1) {
						throw new Error(
							'you are only allowed to use on behaviour per dom node'
						)
					}

					const item = { name: spon, node, data: rest, hasMounted: false }
					if (typeof keepAlive !== 'undefined') item.keepAlive = true
					if (query) item.query = query
					cache.set(spon, item)
				})

			scan()
			handle = throttle(scan)
			window.addEventListener('resize', handle)
		})
	}

	function destroy() {
		window.removeEventListener('resize', handle)
		Object.values(killList).forEach(({ module, observer, name }) => {
			module()
			observer.disconnect()
			cache.delete(name)
		})
	}

	return {
		hydrate,
		destroy
	}
}

export default loader
