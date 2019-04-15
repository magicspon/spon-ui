// @ts-check

import { eventBus } from '@spon/core'
import domEvents from '@spon/domevents'
import keycodes from '@/utils/keycodes'
import { getIdFromHref } from '@/utils'

/**
 * @module ui/dropdown
 */

/**
 * @function dropdown
 * @example
 * const dd = dropdown({ node: document.getElementById('btn'), name: 'user-menu' })
 * const html = document.documentElement
 *
 * dd.init()
 *
 * dd.on('user-menu:open', ({ target }) => {
 * 	if (html.classList.contains('user-is-tabbing')) {
 * 		target.querySelector('a').focus()
 * 	}
 * })
 *
 * <div id="user-menu-dd" data-behaviour="userMenu">
 * 	 <a href="#user-menu" data-dropdown-button>button</a>
 *	 <div id="user-menu" data-dropdown-menu>...stuff</div>
 * </div>
 *
 * @param {Object} options
 * @property {HTMLElement} options.node - the root node, events are bound to this element
 * @property {String} options.name - a name to to use for events
 * @return {dropdownType}
 */

/**
 * @typedef {Object} dropdownType
 * @property {function} dropdown.init - Bind the toggle events
 * @property {function} dropdown.destroy - Destroy the toggle events and reset any state
 * @property {function} dropdown.open - Open the toggle
 * @property {function} dropdown.close - Close the toggle
 * @property {function} dropdown.on - eventBus on event
 * @property {function} dropdown.off - eventBus off event
 * @property {function} dropdown.emit - eventBus emit event
 *
 */

function dropdown({ node, name }) {
	/**
	 * get the button
	 *
	 * @private
	 * @type {HTMLElement}
	 */
	const button = node.querySelector('[data-dropdown-button]')

	/**
	 * remove the hash
	 *
	 * @private
	 * @type {String}
	 */
	const targetId = getIdFromHref(button)

	/**
	 * get the target element
	 *
	 * @private
	 * @type {HTMLElement}
	 */
	const target = document.getElementById(targetId)

	/**
	 * get the items
	 *
	 * @private
	 * @type {NodeListOf}
	 */
	const items = node.querySelectorAll('[data-dropdown-item]')

	/**
	 * the current tabIndex
	 *
	 * @private
	 * @type {number}
	 */
	let tabIndex = 0

	/**
	 * a placeholder for the dom events container
	 *
	 * @private
	 * @type {undefined|object}
	 */
	let events

	target.setAttribute('tabindex', '-1')

	/**
	 * @function open
	 * @memberOf dropdown
	 * @inner
	 * @return {void}
	 */
	function open() {
		target.classList.add('is-open')
		target.focus()
		button.setAttribute('aria-expanded', 'true')
		target.setAttribute('aria-hidden', 'false')
		eventBus.emit(`${name}:open`, { target, button })
	}

	/**
	 * @function close
	 * @memberOf dropdown
	 * @inner
	 * @return {void}
	 */
	function close() {
		tabIndex = 0
		target.classList.remove('is-open')
		button.setAttribute('aria-expanded', 'false')
		target.setAttribute('aria-hidden', 'true')
		eventBus.emit(`${name}:close`, { target, button })
	}

	/**
	 * @function onBlur
	 * @memberOf dropdown
	 * @inner
	 * @return {void}
	 */
	function onBlur() {
		setTimeout(() => {
			if (
				!target.contains(document.activeElement) &&
				document.activeElement !== button
			) {
				close()
			}
		})
	}

	/**
	 * @function clickHandle
	 * @memberOf dropdown
	 * @inner
	 * @param {Event} e -event object
	 * @return {void}
	 */
	function clickHandle(e) {
		e.preventDefault()

		if (!target.classList.contains('is-open')) {
			open()
		} else {
			close()
		}
	}

	/**
	 * @function keyCodeAction
	 * @memberOf dropdown
	 * @inner
	 * @param {Number} key the key code
	 * @return {Function}
	 */
	function keyCodeAction(key) {
		return {
			[keycodes.ESC_KEY]: () => {
				close()
				button.focus()
			},

			[keycodes.UP_KEY]: () => {
				if (tabIndex > 0) {
					tabIndex -= 1
					items[tabIndex].focus()
				} else {
					tabIndex = 0
					close()
					button.focus()
				}
			},

			[keycodes.DOWN_KEY]: () => {
				if (tabIndex < items.length - 1) {
					tabIndex += 1
					items[tabIndex].focus()
				}
			}
		}[key]
	}

	/**
	 * @function init
	 * @memberOf dropdown
	 * @inner
	 * @return {void}
	 */
	function init() {
		events = events || domEvents(node)
		target.setAttribute('tabindex', '-1')
		target.setAttribute('aria-hidden', 'true')
		target.setAttribute('role', 'dialog')
		button.setAttribute('aria-controls', targetId)
		button.setAttribute('aria-expanded', 'false')

		events.addEvents({
			'click [data-dropdown-button]': clickHandle,
			'click [data-dropdown-item]': (e, elm) => {
				eventBus.emit(`${name}:click`, { e, elm })
			},
			'blur [data-dropdown-menu]': [onBlur, true],
			keydown: e => {
				const action = keyCodeAction(e.keyCode)
				if (action) action()
			}
		})
	}

	/**
	 * @function destroy
	 * @memberOf dropdown
	 * @inner
	 * @return {void}
	 */
	function destroy() {
		events.removeEvents()
		eventBus.off(`${name}:click`)
		target.removeAttribute('tabindex')
		target.removeAttribute('aria-hidden')
		target.removeAttribute('role')
		button.removeAttribute('aria-controls')
		button.removeAttribute('aria-expanded')
	}

	return {
		init,
		destroy,
		open,
		close,
		...eventBus
	}
}

export default dropdown
