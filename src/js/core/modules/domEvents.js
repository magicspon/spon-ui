// @ts-check

import delegate from 'dom-delegate'
import { createStore } from '../utils'

/**
 * @typedef {Object} EventDelegator
 * @property {function} addEvents add delegated events
 * @property {function} removeEvents remove all events
 * @property {function} removeEvent remove event by key
 */

/**
 * @namespace
 * @function domEvents
 * @param {HTMLElement} node
 * @return {EventDelegator}
 */
function domEvents(node = document.body) {
	const root = delegate(node)
	const eventStore = createStore()

	/**
	 * @memberof domEvents
	 * @function addEvents
	 * @description key/values to delegated events
	 * @param  {...any} args
	 * @return {void}
	 */
	function addEvents(...args) {
		const withRoot = args.length > 1
		const events = withRoot ? args[1] : args[0]
		const rootNode = withRoot ? delegate(args[0]) : root

		Object.entries(events).forEach(([key, fn]) => {
			const [event, selector] = key.split(' ')
			eventStore.add(`${event} ${selector}`, { fn, rootNode })
			rootNode.on(event, selector, fn)
		})
	}

	/**
	 * @memberof domEvents
	 * @function removeEvent
	 * @description unbind an event by key
	 * @param {string} key
	 * @return {void}
	 */
	function removeEvent(key) {
		const [event, selector] = key.split(' ')
		const { fn, rootNode } = eventStore.store[key]

		rootNode.off(event, selector, fn)
	}

	/**
	 * @memberof domEvents
	 * @function removeEvents
	 * @description Remove all the events
	 * @return {void}
	 */
	function removeEvents() {
		root.destroy()
	}

	return {
		addEvents,
		removeEvents,
		removeEvent
	}
}

/**
 * @namespace withDomEvents
 * @property {object} props
 * @property {HTMLElement} props.node the root node to attach events to
 * @property {function} props.register a function used to store the destroy method
 * @return {object}
 */
export function withDomEvents({ node, register }) {
	const events = domEvents(node)
	register(events.removeEvents)
	return events
}

export default domEvents
