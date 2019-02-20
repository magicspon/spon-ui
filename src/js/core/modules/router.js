// @ts-check

import url from 'url-parse'
import createHistory from 'history/createBrowserHistory'
import sync from 'framesync'
import pathToRegexp from 'path-to-regexp'
import domEvents from './domEvents'
import { createNode } from './refs'
import {
	preventClick,
	getKey,
	getTransition,
	createStore,
	createStack
} from './router.utils'

const noop = () => {}

function getTransitionFromPath(transitions, href) {
	return Object.keys(transitions).reduce((acc, key) => {
		const regexp = pathToRegexp(key)
		if (regexp.exec(href)) {
			if (acc.length) {
				if (acc.length < key.length) {
					acc = key
				}
			} else {
				acc = key
			}
		}

		return acc
	}, '')
}

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
 * @param {object} props.eventBus
 * @param {object} props.settings
 * @return {PageTransitionManager}
 */
function router({
	eventBus,
	settings = {
		rootNode: document.getElementById('page-wrapper'),
		ignoreProp: 'data-no-route',
		pageSelector: '[data-route]'
	}
}) {
	const isIE =
		!!navigator.userAgent.match(/Trident/g) ||
		!!navigator.userAgent.match(/MSIE/g)
	if (isIE) {
		return { add: noop, delete: noop }
	}

	let prevHtml = null
	let action
	let running = false

	const historyStack = createStack()

	const store = createStore({
		current: {
			key: getKey(
				/** @type {HTMLElement} */ document.body,
				settings.pageSelector
			),
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
			container: createNode(settings.rootNode),
			fetchOptions: {
				headers: {
					'X-Spon-Header': 'X-Spon-Header'
				}
			},

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
			getKey(doc, settings.pageSelector),
			pathname
		)
		const newHtml = createNode(doc.querySelector(settings.pageSelector))

		const commonProps = {
			prevHtml, // old wrapper
			newHtml, // just the stuff in the wrapper
			update,
			doc // the entire html response
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

		const { fetchOptions } = transitions[
			getTransitionFromPath(transitions, params) || 'default'
		]

		const exitingTransition =
			transitions[
				getTransitionFromPath(transitions, window.location.pathname) ||
					'default'
			]

		if (exitingTransition.beforeExit) {
			exitingTransition.beforeExit()
		}

		const key = getKey(document.body, settings.pageSelector)

		const rootNode = createNode(document.querySelector(settings.pageSelector))
		if (!rootNode) {
			throw new Error('data-route missing from current page ')
		}
		prevHtml = rootNode
		eventBus.emit('route:before/onExit', { params })

		await store.dispatch({
			...params,
			key: key || null,
			fetchOptions
		})
		await start(store.getState())

		eventBus.emit('route:after/onExit', { params })
	}

	history.listen((location, event) => {
		const { state: params } = location
		action = event
		if (event === 'POP') {
			historyStack.pop()
			goTo({
				...params,
				href: !historyStack.isEmpty()
					? historyStack.peek()
					: window.location.href
			})
		}

		eventBus.emit('route:history/change', {
			location,
			event,
			params,
			historyStack
		})
	})

	/**
	 * @function clickHandle
	 * @description delegate a click event on all of the dom anchors
	 * @param {MouseEvent} e
	 * @param {HTMLAnchorElement} elm
	 * @return {void}
	 */
	function clickHandle(e, elm) {
		if (preventClick(e, elm, settings.ignoreProp)) {
			e.preventDefault()
			const { href } = elm
			const params = url(href)
			if (history.location.pathname === params.pathname) {
				return
			}

			if (!running) {
				historyStack.push(href)
				eventBus.emit('route:click', { elm, params })
				goTo(params)
			}
		}
	}

	del.addEvents({ [`click a:not([${settings.ignoreProp}])`]: clickHandle })

	setTimeout(() => {})

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
