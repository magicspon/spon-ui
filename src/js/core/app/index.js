import sync from 'framesync'
import throttle from 'raf-throttle'
import { createStore, registerPlugins } from '../utils'
import eventBus from '../modules/eventBus'
import domEvents from '../modules/domEvents'
import { createNode } from '../modules/refs'

export const cache = createStore()

export const registerPlugin = registerPlugins(cache)

export default function loadApp(context) {
	let handle
	const plugins = {}

	function loadModule({ module, node, name, keepAlive, key }) {
		// call it, and assign it to the cache
		// so that it can be called to unmoumt
		const register = registerPlugin(key)

		const destroyModule = module({
			node,
			name,
			key
		})

		cache.set(name, {
			hasLoaded: true,
			keepAlive
		})

		if (!keepAlive) {
			register(destroyModule)
		}
	}

	function scan() {
		const list = cache.store

		Object.entries(list).forEach(async ([key, item]) => {
			const { query, name, node, hasLoaded, module, keepAlive } = item
			// if the module has loaded
			if (hasLoaded) {
				// if the query has failed
				if (query && !window.matchMedia(query).matches) {
					module()
					// update the cache
					cache.set(key, {
						hasLoaded: false
					})
				}
				return
			}
			// if there is a query and it matches, or if there is no query at all
			if (window.matchMedia(query).matches || typeof query === 'undefined') {
				if (cache.get(key) && cache.get(key).hasLoaded) return
				// fetch the behaviour
				const resp = await import(/* webpackChunkName: "spon-[request]" */ `@/behaviours/${name}`)
				const { default: module } = resp
				loadModule({ module, node, name, keepAlive, query, key })
			}
		})
	}

	function hydrate(context) {
		sync.read(() => {
			const nodes = [...context.querySelectorAll('*[data-spon]')]
			nodes
				.filter(({ dataset: { keepAlive, spon } }) => {
					return keepAlive === 'true' || !cache.has(spon)
				})
				.forEach((node, index) => {
					const { spon, query, keepAlive, ...rest } = node.dataset
					if (spon.split(' ').length > 1) {
						throw new Error(
							'you are only allowed to use on behaviour per dom node'
						)
					}
					const key = `${spon}-${index}`

					const item = {
						key,
						name: spon,
						node,
						data: rest,
						hasLoaded: false
					}
					if (typeof keepAlive !== 'undefined') item.keepAlive = true
					if (query) item.query = query
					cache.set(key, item)
				})

			scan()
			handle = throttle(scan)
			window.addEventListener('resize', handle)
		})
	}

	function destroy() {
		window.removeEventListener('resize', handle)
		const killList = Object.values(cache.store).filter(
			({ keepAlive }) => !keepAlive
		)

		// destroy each module and any plugins attached
		killList
			.reduce((acc, { plugins }) => {
				if (plugins) {
					acc.push(...plugins)
				}
				return acc
			}, [])
			.forEach((destroy = () => {}) => destroy())

		// remove the item from the store
		killList.forEach(({ name }) => cache.delete(name))
	}

	hydrate(context)

	function use(key, func, options = {}) {
		const plug = func({
			domEvents,
			createNode,
			hydrateApp: hydrate,
			destroyApp: destroy,
			eventBus,
			...options
		})

		plugins[key] = plug
	}

	return {
		hydrate,
		destroy,
		...eventBus,
		use,
		get plugins() {
			return plugins
		}
	}
}
