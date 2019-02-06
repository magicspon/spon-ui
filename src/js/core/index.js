import sync from 'framesync'
import throttle from 'raf-throttle'
import store from '@/store'
import domEvents from './domEvents'
import getRefs from './refs'
import { createStore, bindStoreToRender } from './utils'
// import router from './router'
import h from './dom'
import eventBus from './eventBus'

const cache = createStore()
const killList = {}

export const connect = (state, dispatch, ...fns) => {
	const localState = state(store.getState())
	const render = bindStoreToRender(localState, store)
	return module => {
		return props => {
			return module({
				...props,
				render(fn) {
					module.subsciption = store.subscribe(render(fn))
				},
				...localState,
				...dispatch(store.dispatch),
				...fns.reduce(
					(acc, curr) => ({ ...acc, ...curr({ store, ...props }) }),
					{}
				)
			})
		}
	}
}

function loadModule({ module, node, name, keepAlive, query }) {
	if (cache.get(name) && cache.get(name).hasLoaded) return
	const { refs, observer } =
		getRefs(node, [...node.querySelectorAll('[data-ref]')]) || {}
	// call it, and assign it to the cache
	// so that it can be called to unmoumt
	const destroyModule = module({
		node,
		domEvents,
		// store,
		// render,
		h,
		refs
	})
	if (typeof query === 'undefined') {
		cache.delete(name)
	} else {
		cache.set(name, {
			module: destroyModule,
			observer,
			hasLoaded: true
		})
	}

	if (!keepAlive) {
		killList[name] = { module: destroyModule, observer, name }
	}
}

export function cloneModule(module, { node, name, keepAlive = false }) {
	loadModule({ module, node, name, keepAlive })
}

function loadApp(context) {
	let handle

	function scan() {
		const list = cache.store

		Object.entries(list).forEach(async ([key, item]) => {
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
					cache.set(key, {
						hasLoaded: false
					})

					// store.dispatch.loader.removeModule(name)
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

				loadModule({ module, node, name, keepAlive, query })
				// sync.postRender(() => {
				// 	store.dispatch.loader.addModule(name)
				// })
			}
		})
	}

	function hydrate(context) {
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
		Object.values(killList).forEach(({ module, observer, name, ...rest }) => {
			if (module.subsciption) {
				module.subsciption()
			}
			module()
			if (observer) {
				observer.disconnect()
			}
			cache.delete(name)
		})
	}

	hydrate(context)

	return {
		hydrate,
		destroy,
		// router: router(store),
		...eventBus
	}
}

export default loadApp
