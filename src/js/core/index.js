import sync from 'framesync'
import throttle from 'raf-throttle'
import store from '@/store'
import { createStore, bindStoreToRender, registerPlugins } from './utils'
import router from './router'
import eventBus from './eventBus'

const cache = createStore()

export function connect(STATE, DISPATCH, ...fns) {
	const asObject = typeof STATE !== 'function'
	const [state, dispatch] = asObject ? STATE.store : [STATE, DISPATCH]
	const localState = state(store.getState())
	const plugins = (asObject ? STATE.plugins : fns) || []
	const render = bindStoreToRender(localState, store)

	return module => {
		return ({ name, ...props }) => {
			return module({
				...props,
				render: fn => {
					registerPlugins(cache, name)(store.subscribe(render(fn)))
				},
				store: {
					...localState,
					...dispatch(store.dispatch)
				},
				...plugins.reduce(
					(acc, curr) => ({
						...acc,
						...curr({
							register: registerPlugins(cache, name),
							store,
							...props
						})
					}),
					{}
				)
			})
		}
	}
}

function loadApp(context) {
	let handle

	function loadModule({ module, node, name, keepAlive }) {
		// call it, and assign it to the cache
		// so that it can be called to unmoumt
		const register = registerPlugins(cache, name)
		const destroyModule = module({
			node,
			name
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
				if (cache.get(name) && cache.get(name).hasLoaded) return
				// fetch the behaviour
				const resp = await import(/* webpackChunkName: "spon-[request]" */ `@/behaviours/${name}`)
				const { default: module } = resp
				loadModule({ module, node, name, keepAlive, query })
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
		const killList = Object.values(cache.store).filter(
			({ keepAlive }) => !keepAlive
		)

		// destroy each module and any plugins attached
		killList
			.map(({ plugins }) => plugins)
			.flatMap(plugin => plugin)
			.forEach((destroy = () => {}) => destroy())

		// remove the item from the store
		killList.forEach(({ name }) => cache.delete(name))
	}

	hydrate(context)

	return {
		hydrate,
		destroy,
		router: router(store),
		...eventBus
	}
}

export default loadApp
