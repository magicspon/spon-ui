import { createEvents } from '@/core/modules/createEvents'
import mitt from 'mitt'
import setStyle from '@/core/dom-utils/setStyle'
import eventPromise from '@/utils/eventPromise'
import animationEnd from '@/utils/animationEnd'

/** *
 * @namespace Accordion
 * @class Accordion
 * @desc This class handles accordions... 
 * @example 
 * 
 * js: 
 * 
 * new Accordion(document.getElementById('accordion'), { 
 * 	closeOthers: true 
 * }, 'ui-key').mount()
 * 
 * Required markup:
 * 
 * <ul data-ui="Accordion" data-ui-options='{"close-others": true, "active-index": 1}' data-ui-key="downloads-accordion">
		<li>
			<a href="#bt1" data-accordion-button>Datasheets</a>
			<ul class="list-reset hidden" data-accordion-dropdown id="bt1">...</ul>
		</li>
		<li>
			<a href="#bt2" data-accordion-button>Datasheets</a>
			<ul class="list-reset hidden" data-accordion-dropdown id="bt2">...</ul>
		</li>
		<li>
			<a href="#bt3" data-accordion-button>Datasheets</a>
			<ul class="list-reset hidden" data-accordion-dropdown id="bt3">...</ul>
		</li>
	</ul>
 *

 * @param {HTMLElement} el - node to bind to
 * @param {Object} options - options
 * @param {String} key - key name
 *
 * @property {Boolean} options.closeOthers - only allow one accordion to be open at a time
 * @property {Number} options.activeIndex - set one of the accordions to be open
 * 
 * @return {Accordion}
 */

export default class Accordion {
	defaults = {
		closeOthers: false,
		activeIndex: undefined
	}

	constructor(el, options, key) {
		const { uiOptions } = el.dataset
		this.options = { ...this.defaults, ...options }
		this.key = key

		if (uiOptions) {
			this.options = { ...this.options, ...JSON.parse(uiOptions) }
		}

		Object.assign(this, mitt())

		this.$el = el
		// bind the dom events
		this.$$events = createEvents.call(this, this.$el, this.events)

		this.$selectedIndex = undefined

		this.$panels = [
			...this.$el.querySelectorAll('[data-accordion-button]')
		].map((button, index) => {
			const href = button.getAttribute('href')
			const target = this.$el.querySelector(`${href}`)

			button.setAttribute('data-accordion-key', index)

			return {
				button,
				target,
				machine: {
					open: { CLICK: 'close' },
					close: { CLICK: 'open' }
				},
				state: this.options.activeIndex === index ? 'open' : 'close',
				isAnimating: false
			}
		})

		if (typeof this.options.activeIndex !== 'undefined') {
			this.open(this.options.activeIndex)
			this.$selectedIndex = this.options.activeIndex
		}
	}

	/** *
	 * @memberof Accordion
	 * @method mount
	 * @desc Add the events
	 *
	 * @return {void}
	 */
	mount = () => {
		log('mount it')
		this.$$events.attachAll()
	}

	events = {
		'click [data-accordion-button]': 'onClick'
	}

	/** *
	 * @memberof Accordion
	 * @method unmount
	 * @desc remove the events
	 *
	 * @return {void}
	 */
	unmount = () => {
		log('unmount it')
		this.$$events.destroy()
	}

	destroy = () => {
		log('kill it')
	}

	/** *
	 * @memberof Accordion
	 * @method onClick
	 * @desc the click event...
	 * @param {Object} e : the event object
	 * @param {HTMLElement} elm : the node clicked
	 *
	 * @return {void}
	 */
	onClick = (e, elm) => {
		e.preventDefault()
		const { closeOthers } = this.options
		const { accordionKey } = elm.dataset
		const key = parseInt(accordionKey, 10)
		// get the current state
		const { state, isAnimating } = this.$panels[key]
		// if the item is currrently animating, bail
		if (isAnimating) return

		// get the new action
		const action = this.$panels[key].machine[state].CLICK

		// if close others, and we have some to close... close it
		if (
			closeOthers &&
			typeof this.$selectedIndex !== 'undefined' &&
			this.$selectedIndex !== key
		) {
			this.close(this.$selectedIndex)
		}

		// do the new action
		this[action](key)

		// update the selected item ref
		this.$selectedIndex = key
	}

	/** *
	 * @memberof Accordion
	 * @method open
	 * @desc Open the accordion
	 * @param {Number} index : index of the accordion to open
	 *
	 * @return {void}
	 */
	open = async index => {
		const { button, target } = this.$panels[index]

		this.$panels[index].isAnimating = true

		target.style.display = 'block'

		const { clientHeight: height } = target

		setStyle(target, {
			height: 0,
			transition: 'height 300ms ease',
			'will-change': 'height'
		})

		await eventPromise(animationEnd('transition'), target, () => {
			setTimeout(() => {
				setStyle(target, {
					height: `${height}px`
				})
			})
		})

		this.$panels[index].isAnimating = false
		this.$panels[index].state = 'open'
		button.classList.add('is-active')
		target.classList.add('is-open')

		setStyle(target, {
			height: ''
		})
	}

	/** *
	 * @memberof Accordion
	 * @method close
	 * @desc Close the accordion
	 * @param {Number} index : index of the accordion to close
	 *
	 * @return {void}
	 */
	close = async index => {
		const { button, target } = this.$panels[index]
		this.$panels[index].isAnimating = true

		const { clientHeight: height } = target
		target.style.height = `${height}px`

		await eventPromise(animationEnd('transition'), target, () => {
			setTimeout(() => {
				setStyle(target, {
					height: '0px'
				})
			})
		})

		this.$panels[index].isAnimating = false
		this.$panels[index].state = 'close'
		target.style.display = ''
		target.style.height = ''
		button.classList.remove('is-active')
		target.classList.remove('is-open')
	}
}
