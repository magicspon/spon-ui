import mitt from 'mitt'
import Hammer from 'hammerjs'
import domify from 'domify'

import mapNodesToMachine from '@/utils/mapNodesToMachine'
import eventPromise from '@/utils/eventPromise'
import animationEnd from '@/utils/animationEnd'

/*
	Options:

	animationType: {String} - animation, transition, custom
	selector: {String} - css selector
	previousButton: {String} - css selector
	nextButton: {String} - css selector
	activeClass: {String} - class name
	loop: {Boolean} 
	delay: {Number} 
	wrap: {Boolean} 
	dots: {Boolean} 
	swipe: {Boolean} 
	promiseBefore: {Boolean} 
	paginationParent: {Boolean} 
	paginationWrapper: {String} - html
	paginationButtons: {Function(items)} - must return an array eg: ['<button></button>','<button></button>']

	Events: 
	Called in order
	const $n = new Slide($HTML, {})

	$n.emitter('spon:prev') - on prev click
	$n.emitter('spon:next') - on next click
	$n.emitter('spon:before') - before promise
	$n.emitter('spon:change') - on change
	$n.emitter('spon:after') - after animation

	API:

	$n.init() - start
	$n.reset() - reset everything
	$n.destroy() - kill it all
	$n.next() - goto next
	$n.prev() - goto prev
	$n.goTo(n) - go to index
	$n.setOptions(o) - update optios object

	HTML:

	<div class="relative overflow-hidden data-ui="slide">
		<ul>
			<li data-slide-item>{{ loop.index }}</li>
			<li data-slide-item>{{ loop.index }}</li>
			<li data-slide-item>{{ loop.index }}</li>
		</ul>
		<a href="#0" data-slide-prev>prev</a>
		<a href="#0" data-slide-next>next</a>
	</div>

*/

export default class {
	defaults = {
		animationType: 'animation',
		selector: '[data-slide-item]',
		previousButton: '[data-slide-prev]',
		nextButton: '[data-slide-next]',
		activeClass: 'c-slide__item--current',
		loop: false,
		delay: 3000,
		wrap: true,
		dots: true,
		swipe: false,
		promiseBefore: false,
		paginationParent: false,
		paginationWrapper:
			'<div class="absolute w-full pin-t z-10 flex justify-center"></div>',
		paginationButtons: slides => slides.map(() => '<button>&#9679</button>')
	}

	constructor($el, options = {}) {
		this.options = { ...this.defaults, ...options }
		this.emitter = mitt()
		this.$el = $el

		log(this)
	}

	/**
	 * @function setOptions
	 * @param {Object} options
	 * @return void
	 */
	setOptions = (options = {}) => {
		this.options = { ...this.options, options }
		return this
	}

	/**
	 * Initalize slides, bind click events and stuff
	 *
	 * @function init
	 * @return this
	 */
	init = () => {
		const {
			selector,
			previousButton,
			nextButton,
			animationType,
			activeClass,
			loop,
			swipe,
			wrap,
			dots
		} = this.options
		const $item = this.$el.querySelector(`.${activeClass}`)

		this.$slides = [...this.$el.querySelectorAll(selector)]
		this.total = this.$slides.length - 1
		this.currentIndex = 0
		this.$prevBtn = previousButton && this.$el.querySelector(previousButton)
		this.$nextBtn = nextButton && this.$el.querySelector('[data-slide-next]')
		this.animationEvent = animationEnd(animationType)

		this.handle
		this.timer

		!$item && this.$slides[0].classList.add(activeClass)

		this.machine = mapNodesToMachine(this.$slides, wrap)
		this.$prevBtn && this.$prevBtn.addEventListener('click', this.prev)
		this.$nextBtn && this.$nextBtn.addEventListener('click', this.next)

		dots && this._renderPager(this.currentIndex)
		loop && this._loop()
		swipe && this._addGestures()

		return this
	}

	/**
	 * reset the slides
	 *
	 * @function reset
	 * @return this
	 */
	reset = () => {
		const { selector, activeClass, loop, wrap } = this.option
		const i = this.$nodes.indexOf(this.$el.querySelector(`.${activeClass}`))
		if (loop) this._cancelLoop()
		this.currentIndex = i > -1 ? i : 0
		this.$slides = [...this.$el.querySelectorAll(selector)]
		this.total = this.$slides.length - 1
		this.machine = mapNodesToMachine(this.$slides, wrap)
		return this
	}

	/**
	 * destroy the slide, remove all events
	 *
	 * @function destroy
	 * @return this
	 */
	destroy = () => {
		const { activeClass, loop, swipe, dots } = this.option
		if (loop) this._cancelLoop()

		if (this.$prevBtn) {
			this.$prevBtn.removeEventListener('click', this.prev)
			this.$prevBtn.removeAttribute('disabled')
		}

		if (this.$nextBtn) {
			this.$nextBtn.removeEventListener('click', this.next)
			this.$nextBtn.removeAttribute('disabled')
		}

		if (dots) {
			this.$pagerButtons.forEach(node =>
				node.removeEventListener('click', this.onPagerClick)
			)
			this.$pagerWrapper.parentNode.removeChild(this.$pagerWrapper)
		}

		if (swipe) {
			this._mc.destroy()
		}

		this.$slides[this.currentIndex].classList.remove(activeClass)
		this.$slides.forEach(node => node.setAttribute('data-slide-item'))
		this.$slides = []
		this.emitter.off('*')
		return this
	}

	/**
	 * trigger PREV actions
	 *
	 * @function prev
	 * @return void
	 */
	prev = e => {
		e && e.preventDefault()
		this.emitter.emit('spon:prev')
		this._transition(this.currentIndex, 'PREV')
	}

	/**
	 * trigger Next actions
	 *
	 * @function next
	 * @return void
	 */
	next = e => {
		e && e.preventDefault()
		this.emitter.emit('spon:next')
		this._transition(this.currentIndex, 'NEXT')
	}

	/**
	 * Function to run before updating the dom
	 *
	 * @function before
	 * @param {Object} props
	 * @return Promise
	 */
	before = props => {
		const { promiseBefore } = this.options
		if (!promiseBefore) return Promise.resolve()
		return new Promise(resolve => {
			this.emitter.emit('spon:before', { props, resolve })
		})
	}

	/**
	 * Update function
	 *
	 * @function goTo
	 * @param {Number} state
	 * @return void
	 */
	goTo = state => {
		if (this.currentIndex === state || this.isRuning) return
		this.isRuning = true
		const { activeClass, loop, animationType, dots } = this.options
		const forwards =
			(state > this.currentIndex ||
				(state === 0 && this.currentIndex === this.total)) &&
			!(state === this.total && this.currentIndex === 0)

		const $current = this.$slides[this.currentIndex]
		const $next = this.$slides[state]

		const props = {
			direction: forwards ? 'forwards' : 'backwards',
			currentEl: $current,
			nextEl: $next
		}

		const beforeProps = {
			...props,
			newIndex: state,
			currentIndex: this.currentIndex
		}

		if (loop) this._cancelLoop()

		if (animationType === 'animation' || animationType === 'transition') {
			this.before({
				...beforeProps
			}).then(() => {
				this.emitter.emit('spon:change', beforeProps)

				this.$slides
					.filter((_, index) => index !== this.currentIndex && index !== state)
					.forEach(node => node.setAttribute('data-slide-item', ''))

				eventPromise(this.animationEvent, $current, () => {
					$current.classList.remove(activeClass)
					$current.setAttribute(
						'data-slide-item',
						forwards ? 'hide-prev' : 'hide-next'
					)
				}).then(() => {
					this.emitter.emit('spon:after', props)
				})

				$next.classList.add(activeClass)
				$next.setAttribute(
					'data-slide-item',
					forwards ? 'show-next' : 'show-prev'
				)
				dots && this._updatePagerButtons(state)
				this.currentIndex = state

				this.isRuning = false
				if (loop) this._loop()
			})
		} else {
			this._customTransition(beforeProps).then(() => {
				dots && this._updatePagerButtons(state)
				this.emitter.emit('spon:after', props)
				this.currentIndex = state
				this.isRuning = false
				if (loop) this._loop()
			})
		}
	}

	/**
	 * get the new state
	 *
	 * @function transition
	 * @return this
	 */
	_transition = (state, action) => {
		const newState = this.machine[state][action]
		this.goTo(newState.index)
	}

	/**
	 * hook used for custom transitons, when animation type is not animation or transition
	 *
	 * @function customTransition
	 * @param {Object} props
	 * @return Promise
	 */
	_customTransition = props => {
		const { promiseBefore } = this.options
		if (!promiseBefore) return Promise.resolve()
		return new Promise(resolve => {
			this.emitter.emit('spon:before', { props, resolve })
		})
	}

	/**
	 * @function _onPagerClick
	 * @param {Number} state
	 * @return void
	 */
	_onPagerClick = state => {
		this._updatePagerButtons(state)
		this.goTo(state)
	}

	/**
	 * @function onPagerClick
	 * @param {Number} state
	 * @return void
	 */
	_updatePagerButtons = state => {
		this.$pagerButtons[this.currentIndex].setAttribute('data-slide-pager', '')
		this.$pagerButtons[state].setAttribute('data-slide-pager', 'active')
	}

	/**
	 * Add pager html and bind events
	 *
	 * @function renderPager
	 * @param {Number} state
	 * @return void
	 */
	_renderPager = state => {
		const {
			paginationParent,
			paginationWrapper: wrapper,
			paginationButtons: buttons
		} = this.options

		const $parent = paginationParent ? paginationParent : this.$el

		this.$pagerWrapper = $parent.appendChild(domify(wrapper))
		this.$pagerButtons = buttons(this.$slides)
			.map(html => domify(html))
			.map((html, index) => {
				html.setAttribute('data-slide-pager', index === state ? 'active' : '')
				html.addEventListener('click', this._onPagerClick.bind(this, index))
				return html
			})

		this.$pagerWrapper.appendChild(
			this.$pagerButtons.reduce((acc, item) => {
				acc.appendChild(item)
				return acc
			}, document.createDocumentFragment())
		)
	}

	/**
	 * Request animation frame loop
	 *
	 * @function loop
	 * @return void
	 */
	_loop = () => {
		const { delay } = this.options
		this.timer = setTimeout(() => {
			this.handle = requestAnimationFrame(this._loop)
			this.next()
		}, delay)
	}

	/**
	 * @function cancelLoop
	 * @return void
	 */
	_cancelLoop = () => {
		cancelAnimationFrame(this.handle)
		clearTimeout(this.timetimerout)
	}

	/**
	 *
	 * add gestures
	 *
	 * @function addGestures
	 * @return void
	 */
	_addGestures = () => {
		this._mc = new Hammer(this.$el)
		this._mc.on('panend', this._onPanEnd)
	}

	/**
	 * the gesture event
	 * @function onPanEnd
	 * @param {Object : { string }} additionalEvent
	 * @return void
	 */
	_onPanEnd = ({ additionalEvent }) => {
		if (additionalEvent === 'panleft') {
			this.prev()
		} else if (additionalEvent === 'panright') {
			this.next()
		}
	}
}
