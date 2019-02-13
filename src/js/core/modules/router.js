// @ts-check

import url from 'url-parse'
import quicklink from 'quicklink/dist/quicklink'
import createHistory from 'history/createBrowserHistory'
import sync from 'framesync'
import {
	preventClick,
	getKey,
	getTransition,
	createStore,
	createStack
} from './router.utils'

const noop = () => {}

/**
 * @typedef {object} PageTransitionManager
 * @property {function} add add a page transition
 * @property {function} delete remove a page transition
 */

/**
 * @function router
 * @description this is a sponjs plugin. When it's called with the use function
 * a number of methods and event hooks are supplied
 * @param {object} props
 * @param {function} props.domEvents
 * @param {function} props.createNode
 * @param {function} props.hydrateApp
 * @param {function} props.destroyApp
 * @param {object} props.eventBus
 * @return {PageTransitionManager}
 */
function router({ domEvents, createNode, hydrateApp, destroyApp, eventBus }) {
	const isIE =
		!!navigator.userAgent.match(/Trident/g) ||
		!!navigator.userAgent.match(/MSIE/g)
	if (isIE) {
		return { add: noop, delete: noop }
	}

	const historyStack = createStack()

	const store = createStore({
		current: {
			key: getKey(/** @type {HTMLElement} */ document.body),
			params: url(window.location.href),
			html: ''
		},
		prev: {}
	})
	const parser = new DOMParser()

	/**
	 * @function update
	 * @description wrap a function in a promise and call during the render phases of sync
	 * @param {function} fn
	 * @return {Promise}
	 */
	function update(fn) {
		return new Promise(resolve => {
			sync.render(() => {
				fn(resolve)
			})
		})
	}

	const history = createHistory()
	const del = domEvents(document.body)
	const transitions = {
		default: {
			name: 'default',
			container: createNode(document.getElementById('page-wrapper')),

			async onExit({ update, prevHtml }) {
				await update(next => {
					prevHtml.node.parentNode.removeChild(prevHtml.node)
					next()
				})
			},

			async onEnter({ update, newHtml }) {
				const { node } = newHtml
				this.container.node.appendChild(node)
				await update(next => next())
			}
		}
	}
	let prevHtml = null
	let action
	let running = false

	quicklink({
		origins: ['localhost']
	})

	/**
	 * @function start
	 * @description start the page transition
	 * @param {Object} props
	 * @param {Object} props.prev the previous route store object
	 * @param {Object} props.current the current route store object
	 * @return {Promise}
	 */
	async function start({ prev, current: state }) {
		const { html, params } = state
		const { pathname } = params
		const getTrans = getTransition(transitions)
		const { transition: prevTransition, name: prevName } = getTrans(
			state.key,
			prev.params.pathname
		)

		/** @type {any} */
		const doc = parser.parseFromString(html, 'text/html')
		const { transition: nextTransition, name: nextName } = getTrans(
			getKey(doc),
			pathname
		)
		const newHtml = createNode(doc.querySelector('[data-route]'))

		quicklink({
			ignores: [
				uri => {
					return !historyStack.stack.includes(uri)
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
		running = false
	}

	/**
	 * @function goTo
	 * @description make a fetch request for the next page, and start the transition process
	 * @param {Object} params
	 * @return {Promise}
	 */
	async function goTo(params) {
		running = true
		const key = getKey(document.body)
		const rootNode = createNode(document.querySelector('[data-route]'))
		if (!rootNode) {
			throw new Error('data-route missing from current page ')
		}
		prevHtml = rootNode
		eventBus.emit('route:before/onExit')

		await store.dispatch({ ...params, key: key || null })
		console.log('start')
		await start(store.getState())
		console.log('done')

		eventBus.emit('route:after/onExit')
	}

	history.listen((location, event) => {
		console.log('history')
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

	/**
	 * @function clickHandle
	 * @description delegate a click event on all of the dom anchors
	 * @param {MouseEvent} e
	 * @param {HTMLAnchorElement} elm
	 * @return {void}
	 */
	function clickHandle(e, elm) {
		console.log('click')
		if (preventClick(e, elm)) {
			e.preventDefault()
			const { href } = elm
			const params = url(href)
			if (history.location.pathname === params.pathname) {
				return
			}
			if (!running) {
				historyStack.push(href)
				goTo(params)
			}
		}
	}

	del.addEvents({ 'click a': clickHandle })

	return {
		/**
		 * @method add
		 * @description add a new page transition
		 * @param {string} path
		 * @param {function} fn
		 * @return {void}
		 */
		add(path, fn) {
			transitions[path] = Object.assign(
				{},
				{
					container: createNode(document.getElementById('page-wrapper'))
				},
				fn({ store, transitions })
			)
		},

		/**
		 * @method delete
		 * @description delete an existing page transition
		 * @param {string} path
		 * @return {void}
		 */
		delete(path) {
			delete transitions[path]
		}
	}
}

export default router
