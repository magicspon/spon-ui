import mitt from 'mitt'
import Slide from 'spon-slide'

/** *
 * @namespace Carousel
 * @class Carousel
 * @desc This class handles Carousels... 
 * @example 
 * 
 * js: 
 * 
 * new Carousel(document.getElementById('test'), {}, 'test-node').mount()
 * 
 * Required markup:
 * 
 * <div class="relative overflow-hidden" data-ui="Carousel">
		<ul>
			<li data-slide-item>{{ loop.index }}</li>
			<li data-slide-item>{{ loop.index }}</li>
			<li data-slide-item>{{ loop.index }}</li>
		</ul>
		<a href="#0" data-slide-prev>prev</a>
		<a href="#0" data-slide-next>next</a>
	</div>
 *

 * @param {HTMLElement} el - node to bind to
 * @param {Object} options - options
 * @param {String} key - key name
 *
 * @property {Boolean} options.XXX - only allow one Carousel to be open at a time
 * @property {Number} options.XXX - set one of the Carousels to be open
 * 
 * @return {Carousel}
 */

export default class Carousel {
	defaults = {
		animationType: 'animation',
		selector: '[data-slide-item]',
		previousButton: '[data-slide-prev]',
		nextButton: '[data-slide-next]',
		activeClass: 'is-current',
		loop: false,
		delay: 6000,
		wrap: true,
		dots: false,
		promiseBefore: false,
		paginationParent: false,
		animateOnInit: false,
		startingIndex: () => 0,
		paginationWrapper: '<div class="c-slide__pagination"></div>',
		accessibility: true,
		paginationButtons: slides => slides.map(() => '<button type="button" />')
	}

	constructor(el, options, key) {
		this.options = { ...this.defaults, ...options }
		this.key = key

		Object.assign(this, mitt())

		this.$el = el
		// bind the dom events
		//	this.$$events = createEvents.call(this, this.$el, this.events)
	}

	/** *
	 * @memberof Carousel
	 * @method mount
	 * @desc Add the events
	 *
	 * @return {void}
	 */
	mount = () => {
		const slide = new Slide(this.$el, this.options)

		slide.init()
	}

	// events = {
	// 	'click [data-my-button]': 'onClick'
	// }

	/** *
	 * @memberof Carousel
	 * @method unmount
	 * @desc remove the events
	 *
	 * @return {void}
	 */
	unmount = () => {
		// this.$$events.destroy()
	}
}
