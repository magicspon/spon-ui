// @ts-check

import { eventBus } from '@spon/plugins'
import { expander } from '@/utils/a11y'
/**
 * @module ui/toggle
 */

/**
 *
 * @function toggle
 * @example
 *
 * const nav = toggle({
 * 	button: document.getElementById('btn'),
 * 	name: 'mobile-menu',
 * 	activeClass: 'is-active'
 * })
 *
 * nav.init()
 *
 * nav.on('open:mobile-menu', ({ target }) => {
 * 	target.classList.add('is-open')
 * })
 *
 * nav.on('close:mobile-menu', ({ target }) => {
 * 	target.classList.remove('is-open')
 * })
 *
 * <a id="mobile-nav-button" href="#site-nav">button</a>
 * <div id="site-nav">target</div>
 *
 * @property {HTMLElement} options.button selector
 * @property {String} options.name selector
 * @property {String} options.activeClass active class name
 * @property {Boolean} options.closeOnBlur active class name
 * @return {toggler}
 */

/**
 * @typedef {Object} toggler
 * @property {HTMLElement} button - the button to control toggling
 * @property {function} init - Bind the toggle events
 * @property {function} destroy - Destroy the toggle events and reset any state
 * @property {function} open - Open the toggle
 * @property {function} close - Close the toggle
 * @property {function} on - eventBus on event
 * @property {function} off - eventBus off event
 * @property {function} emit - eventBus emit event
 * @property {Boolean} isOpen - get the current state, as a getter
 * @property {String} name - get the name of the toggle
 *
 */

function toggle({
	button,
	name = 'draw',
	activeClass = 'is-active',
	closeOnBlur = true
}) {
	/**
	 * get the href off the button
	 *
	 * @private
	 * @type {Boolean}
	 */
	let state = false

	/**
	 * get the href off the button
	 *
	 * @private
	 * @type {String}
	 */
	const targetSelector = button.getAttribute('href')
	/**
	 * remove the hash
	 *
	 * @private
	 * @type {String}
	 */
	const targetId = targetSelector.split('#').pop()
	/**
	 * get the target element
	 *
	 * @private
	 * @type {HTMLElement}
	 */
	const target = document.getElementById(targetId)

	/**
	 * @function open
	 * @memberof toggle
	 * @return {void}
	 */
	function open() {
		state = true
		button.classList.add(activeClass)
		expander.open({ button, target })
		target.focus()
		eventBus.emit(`open:${name}`, { button, target })
	}

	/**
	 * @function close
	 * @memberof toggle
	 * @return {void}
	 */
	function close() {
		state = false
		button.classList.remove(activeClass)
		expander.close({ button, target })
		eventBus.emit(`close:${name}`, { button, target })
	}

	/**
	 * @function clickHandle
	 * @memberof toggle
	 * @param {Event} e the event object
	 * @return {void}
	 */
	function clickHandle(e) {
		e.preventDefault()
		if (!button.classList.contains(activeClass)) {
			open()
		} else {
			close()
		}
	}

	/**
	 * @function onBlur
	 * @memberof toggle
	 * @description
	 * when the user clicks outside of the target
	 * close the menu
	 * @return {void}
	 */
	function onBlur() {
		setTimeout(() => {
			// is the currently focused element within the target...
			// no?.. then close the menu
			if (
				!target.contains(document.activeElement) &&
				document.activeElement !== button
			) {
				close()
			}
		})
	}

	/**
	 * @function init
	 * @memberof toggle
	 * @description add the event listeners and attributes
	 * @return {void}
	 */
	function init() {
		expander.init({ button, target, id: targetId })

		button.addEventListener('click', clickHandle)
		if (closeOnBlur) {
			target.addEventListener('blur', onBlur, true)
		}
	}

	/**
	 * @function destroy
	 * @memberof toggle
	 * @description remove the event listeners and attributes
	 * @return {void}
	 */
	function destroy() {
		// close()
		button.removeEventListener('click', clickHandle)
		button.classList.remove(activeClass)

		if (closeOnBlur) {
			target.removeEventListener('blur', onBlur, true)
		}
		expander.reset({ button, target })
		eventBus.off(`open:${name}`)
		eventBus.off(`close:${name}`)

		state = false
	}

	return {
		button,
		open,
		close,
		init,
		destroy,
		...eventBus,
		get isOpen() {
			return state
		},

		set isOpen(value) {
			state = value
		},

		get name() {
			return name
		}
	}
}

export default toggle
