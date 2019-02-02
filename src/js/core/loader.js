import sync from 'framesync'
import throttle from 'raf-throttle'
import domEvents from './domEvents'
import getRefs from './refs'
import store, { render } from '@/store'

let hasDispatched = false

const cache = new Map()
const killList = {}

function createRefs(node) {
	let refs
	// a noop fallback
	let observer = false
	const refNodes = [...node.querySelectorAll('[data-ref]')]
	if (refNodes.length) {
		const refOb = getRefs(node, refNodes)
		refs = refOb.refs
		observer = refOb.observer
	}

	return { refs, observer }
}

export function cloneModule(module, { node, name, keepAlive = false }) {
	const { refs, observer } = createRefs(node)

	const destroyModule = module({
		node,
		domEvents,
		store,
		render,
		refs
	})

	const clone = cache.get(module.name)

	cache.set(name, {
		...clone,
		node,
		module: destroyModule,
		observer,
		hasLoaded: true
	})

	if (!keepAlive) {
		killList[name] = { module: destroyModule, observer, name }
	}
}

function loadModule(module, node, name, item, keepAlive, query) {
	const { refs, observer } = createRefs(node)
	// call it, and assign it to the cache
	// so that it can be called to unmoumt
	const destroyModule = module({
		node,
		domEvents,
		store,
		render,
		refs
	})

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

function loader(context) {
	let handle

	const scan = () => {
		log(cache.get('trackMove-2'))
		cache.forEach(async item => {
			const { query, name, node, hasLoaded, module, keepAlive, observer } = item
			// has the item already been loaded
			// and it no longer query object no longer passes
			if (hasLoaded) {
				// if the query no longer passes call the unmount method
				if (query && !window.matchMedia(query).matches && hasLoaded) {
					// remove it from the kill list

					// call the module, it has already been called
					// once so this will be the returned function
					// that should remove any custom event handlers
					module()
					if (observer) {
						observer.disconnect()
					}
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

				loadModule(module, node, name, item, keepAlive, query)

				// update the loader store forcing a render
				// we only
				if (!hasDispatched) {
					hasDispatched = true
					sync.postRender(() => {
						store.dispatch.loader.setLoad()
					})
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

					const item = { name: spon, node, data: rest, hasLoaded: false }
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
			if (observer) {
				observer.disconnect()
			}
			cache.delete(name)
		})
	}

	return {
		hydrate,
		destroy
	}
}

export default loader
