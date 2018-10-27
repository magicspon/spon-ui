import { createEvents } from '@/core/modules/createEvents'
import mitt from 'mitt'
import fromTo from 'mud-from-to'
/** *
 * @namespace ScrollTo
 * @class ScrollTo
 * @desc This class handles ScrollTos... 
 * @example 
 * 
 * js: 
 * 
 * new ScrollTo(document.getElementById('test'), {}).mount()
 * 
 * Required markup:
 * 
 * <div id="test" data-ui="ScrollTo" data-ui-options='{}' data-key="menu-ScrollTo"></div>
 *

 * @param {HTMLElement} el - node to bind to
 * @param {Object} options - options
 *
 * 
 * @return {ScrollTo}
 */

export default class ScrollTo {
	defaults = {}

	constructor(el, options) {
		this.options = { ...this.defaults, ...options }

		Object.assign(this, mitt())

		this.$el = el
		// bind the dom events
		this.$$events = createEvents.call(this, this.$el, this.events)
	}

	/** *
	 * @memberof ScrollTo
	 * @method mount
	 * @desc Add the events
	 *
	 * @return {void}
	 */
	mount = () => {
		this.$$events.attachAll()
	}

	events = {
		'click [data-scroll-to]': 'onClick'
	}

	/** *
	 * @memberof ScrollTo
	 * @method unmount
	 * @desc remove the events
	 *
	 * @return {void}
	 */
	unmount = () => {
		this.$$events.destroy()
	}

	/** *
	 * @memberof ScrollTo
	 * @method onClick
	 * @desc the click event...
	 * @param {Object} e : the event object
	 * @param {HTMLElement} elm : the node clicked
	 *
	 * @return {void}
	 */
	onClick = async (e, elm) => {
		e.preventDefault()
		const href = elm.getAttribute('href')
		const { offset = 0 } = elm.dataset
		const target = document.querySelector(href)
		const { offsetTop } = target

		await fromTo(
			{
				start: window.pageYOffset,
				end: offsetTop + offset
			},
			v => {
				window.scrollTo(0, v)
			}
		)

		this.emit('scrollto/done', { elm, target })
	}
}
