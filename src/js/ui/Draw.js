import { createEvents } from '@/core/modules/createEvents'
import mitt from 'mitt'
import eventPromise from '@/utils/eventPromise'
import animationEnd from '@/utils/animationEnd'
import scrollLock from 'scroll-locker'

/** *
 * @namespace Draw
 * @class Draw
 * @desc This class handles Draws...
 * @example
 *
 *
 * Required markup:
 *
 * <a href="#test" data-ui="Draw" data-ui-options='{}' data-key="menu-draw"></a>
 * <div id="test"></div>
 *
 * maybe?.. maybe data-attributes...
 * hmmm... nah.. id me thinks
 *
 * @param {HTMLElement} el - node to bind to
 * @param {Object} options - options
 *
 * @property {String} options.closeButton - close button selector
 * @property {String} options.openButton - open button selector
 * @property {String} options.buttonClass - active button class
 * @property {String} options.targetClass - open target class
 *
 * @return {Draw}
 */

export default class Draw {
	defaults = {
		closeButton: '[data-menu-closer]',
		openButton: '[data-menu-opener]',
		buttonClass: 'is-active',
		targetClass: 'is-visible'
	}

	isOpen = false

	constructor(el, options) {
		this.$el = el
		this.options = {
			...this.defaults,
			...options
		}
		const { closeButton, openButton, target } = this.options

		this.options.dom = {
			$target: document.querySelector(target),
			$openers: [...document.querySelectorAll(openButton)],
			$closers: [...document.querySelectorAll(closeButton)]
		}

		this.scrollLock = scrollLock(document.body)

		// setup the events...
		// the events are not attached until the class is mounted
		this.$$events = createEvents.call(this, document.body, {
			[`click ${openButton}`]: 'onClick',
			[`click ${closeButton}`]: e => {
				e.preventDefault()
				this.close()
			},
			[`blur ${target}`]: 'onBlur'
		})

		Object.assign(this, mitt())
	}

	addAria = () => {
		const {
			target,
			dom: { $target, $openers, $closers }
		} = this.options
		;[...$openers, ...$closers].forEach(item => {
			item.setAttribute('aria-controls', target.replace('#', ''))
			item.setAttribute('aria-expanded', 'false')
		})

		$target.setAttribute('tabindex', '-1')
		$target.setAttribute('aria-hidden', 'true')
		$target.setAttribute('role', 'dialog')
	}

	removeAria = () => {
		const {
			dom: { $target, $openers, $closers }
		} = this.options
		;[...$openers, ...$closers].forEach(item => {
			item.removeAttribute('aria-controls')
			item.removeAttribute('aria-expanded')
		})

		$target.removeAttribute('tabindex')
		$target.removeAttribute('aria-hidden')
		$target.removeAttribute('role')
	}

	/** *
	 * @memberof Draw
	 * @method mount
	 * @desc Add the events
	 *
	 * @return {void}
	 */
	mount = () => {
		this.$$events.attachAll()
		this.addAria()
	}

	/** *
	 * @memberof Draw
	 * @method unmount
	 * @desc remove the events
	 *
	 * @return {void}
	 */
	unmount = () => {
		this.$$events.destroy()
		this.removeAria()
	}

	/** *
	 * @memberof Draw
	 * @method onClick
	 * @desc the click event...
	 * @param {Object} e : the event object
	 * @param {HTMLElement} elm : the node clicked
	 *
	 * @return {void}
	 */
	onClick = e => {
		e.preventDefault()
		if (this.isOpen) {
			this.close()
		} else {
			this.open()
		}
	}

	/** *
	 * @memberof Draw
	 * @method open
	 * @desc Open the Draw and update aria attributes
	 *
	 * @return {void}
	 */
	open = async () => {
		const {
			buttonClass,
			targetClass,
			closeButton,
			dom: { $target, $openers, $closers }
		} = this.options

		this.scrollLock.lock()

		this.emit('draw/open:before', { $target, $openers, $closers })

		await eventPromise(animationEnd('transition'), $target, () => {
			$target.classList.add(targetClass)
		})
		;[...$openers, ...$closers].forEach(item => {
			item.classList.add(buttonClass)
			item.setAttribute('aria-expanded', 'true')
		})

		$target.setAttribute('aria-hidden', 'false')

		const $focusElement = $target.querySelectorAll(`a:not(${closeButton})`)

		if ($focusElement) {
			$focusElement[0].focus()
		}

		this.isOpen = true

		this.emit('draw/open:after', { $target, $openers, $closers })
	}

	/** *
	 * @memberof Draw
	 * @method close
	 * @desc Close the Draw, update aria attributes
	 *
	 * @return {void}
	 */
	close = async () => {
		const {
			buttonClass,
			targetClass,
			dom: { $target, $openers, $closers }
		} = this.options

		this.scrollLock.unlock()

		this.emit('draw/close:before', { $target, $openers, $closers })

		await eventPromise(animationEnd('transition'), $target, () => {
			$target.classList.remove(targetClass)
		})
		;[...$openers, ...$closers].forEach(item => {
			item.classList.remove(buttonClass)
			item.setAttribute('aria-expanded', 'false')
		})

		$target.setAttribute('aria-hidden', 'true')

		this.isOpen = false

		this.emit('draw/close:after', { $target, $openers, $closers })
	}

	/** *
	 * @memberof Draw
	 * @method onBlur
	 * @desc when the focus is outside of the menu, close it
	 *
	 * @return {void}
	 */
	onBlur = () => {
		const { target } = this.options
		setTimeout(() => {
			if (!document.activeElement.closest(target)) {
				this.close()
			}
		})
	}

	/** *
	 * @memberof Draw
	 * @method destroy
	 * @desc when the focus is outside of the menu, close it
	 *
	 * @return {void}
	 */
	destroy = () => {
		this.unmount()
	}
}
