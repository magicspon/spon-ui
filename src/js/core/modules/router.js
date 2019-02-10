import url from 'url-parse'
import quicklink from 'quicklink/dist/quicklink.mjs'
import createHistory from 'history/createBrowserHistory'
import sync from 'framesync'
import {
	preventClick,
	getKey,
	getTransition,
	createStore,
	createStack
} from './router.utils'

/**
 * @function router
 * @description this is a sponjs plugin. When it's called with the use function
 * a number of methods and event hooks are supplied
 * @param {*} param0
 */
function router({ domEvents, createNode, hydrateApp, destroyApp, eventBus }) {
	const historyStack = createStack()
	const store = createStore({
		prevUrl: window.location.href,
		current: {
			key: getKey(document.body),
			params: url(window.location.href)
		}
	})
	const parser = new DOMParser()
	const update = fn => {
		return new Promise(resolve => {
			sync.render(() => {
				fn(resolve)
			})
		})
	}

	const history = createHistory()
	// const debug = document.getElementById('debug')
	// const render = bindStoreToRouter(store)
	const del = domEvents(document.body)
	const transitions = {
		default: {
			name: 'default',
			container: createNode(document.getElementById('page-wrapper')),

			async clearDom(html) {
				const { node, style, addEvent } = html
				return addEvent('transitionend', () => {
					style.set({ opacity: 0 })
				}).then(() => {
					node.parentNode.removeChild(node)
				})
			},

			async onExit({ update, prevHtml }) {
				await update(next => {
					this.clearDom(prevHtml).then(() => {
						next()
					})
				})
			},

			async onEnter({ update, newHtml }) {
				const { node, style, addEvent } = newHtml
				style.set({ opacity: 0 })
				this.container.node.appendChild(node)
				await update(next => {
					addEvent('transitionend', () => {
						style.set({ opacity: 1 })
					}).then(() => {
						next()
					})
				})
			}
		}
	}
	let prevHtml = null
	let action

	quicklink({
		origins: ['localhost']
	})

	async function start({ prev, cache, current: state }) {
		const { html, params } = state
		const { pathname } = params
		const doc = parser.parseFromString(html, 'text/html')
		const getTrans = getTransition(transitions)
		const { transition: prevTransition, name: prevName } = getTrans(
			state.key,
			prev.params.pathname
		)
		const { transition: nextTransition, name: nextName } = getTrans(
			getKey(doc),
			pathname
		)
		const newHtml = createNode(doc.querySelector('[data-route]'))

		quicklink({
			ignores: [
				uri => {
					return !Object.keys(cache).includes(uri)
				}
			]
		})

		const commonProps = {
			prevHtml, // old wrapper
			newHtml, // just the stuff in the wrapper
			update,
			doc, // the entire html response
			hydrateApp,
			destroyApp
		}

		const exitProps = {
			route: prevName,
			params: prev.params,
			to: {
				route: nextName,
				params
			},
			...commonProps
		}

		const enterProps = {
			route: nextName,
			params,
			from: {
				route: prevName,
				params: prev.params
			},
			...commonProps
		}
		if (action !== 'POP') {
			history.push(params.pathname, params)
		}

		await Object.assign({}, transitions.default, prevTransition).onExit(
			exitProps
		)

		eventBus.emit('route:before/onEnter', exitProps)

		await Object.assign({}, transitions.default, nextTransition).onEnter(
			enterProps
		)

		eventBus.emit('route:after/onEnter', enterProps)
	}

	async function goTo(params) {
		const key = getKey(document)
		const rootNode = createNode(document.querySelector('[data-route]'))
		prevHtml = rootNode
		eventBus.emit('route:before/onExit')

		await store.dispatch({ ...params, key: key || null })
		await start(store.getState())

		eventBus.emit('route:after/onExit')
	}

	history.listen(async (location, event) => {
		const { state: params } = location

		action = event
		if (event === 'POP') {
			historyStack.pop()
			if (!historyStack.isEmpty()) {
				goTo({
					...params,
					href: historyStack.peek()
				})
			} else {
				goTo({
					...params,
					href: window.location.href
				})
			}
		}
	})

	del.addEvents({
		'click a': async (e, elm) => {
			if (preventClick(e, elm)) {
				// if (preventClick(e, elm)) return
				e.preventDefault()
				const { href } = elm
				const params = url(href)
				if (history.location.pathname === params.pathname) {
					Promise.resolve()
					return
				}
				historyStack.push(href)
				goTo(params)
			}
		}
	})

	return {
		add(path, fn) {
			transitions[path] = Object.assign(
				{},
				{
					container: createNode(document.getElementById('page-wrapper'))
				},
				fn({ store, transitions })
			)
		},

		delete(path) {
			delete transitions[path]
		}
	}
}

export default router
