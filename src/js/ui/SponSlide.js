import domify from 'domify'
import Concert from 'concert'

export default class Slide extends Concert {
	defaults = {
		selector: '[data-slide]',
		previousButton: '',
		nextButton: '',
		showClass: {
			prev: '',
			next: ''
		},
		hideClass: {
			prev: '',
			next: ''
		},
		wrap: true,

		buttonPreviousClass: 'Wallop-buttonPrevious',
		buttonNextClass: 'Wallop-buttonNext',
		itemClass: 'Wallop-item',
		currentItemClass: 'Wallop-item--current',
		showPreviousClass: 'Wallop-item--showPrevious',
		showNextClass: 'Wallop-item--showNext',
		hidePreviousClass: 'Wallop-item--hidePrevious',
		hideNextClass: 'Wallop-item--hideNext',
		carousel: true,
		pagerContainer: false,
		pagerWrapper: '<ul class="c-slide__pager"></ul>',
		pagerItem: '<li class="c-slide__pager-item"></li>',
		pagerActiveClass: 'is-current',
		delay: 3000,
		swipe: false,
		pager: false,
		loop: false
	}

	constructor(el = document, options = {}) {
		super()
		this.$el = el

		this.$buttonPrevious = this.$el.querySelector(
			`.${this.options.buttonPreviousClass}`
		)
		this.$buttonNext = this.$el.querySelector(
			`.${this.options.buttonNextClass}`
		)
		this.$nodes = [...this.$el.querySelectorAll(`.${this.options.itemClass}`)]
		this.currentItemIndex = this.options.currentItemIndex
			? this.options.currentItemIndex
			: 0
		this.bindEvents()
		this.reset()
		this.updateButtonStates()

		if (this.options.pager) {
			this.renderPager()
		}

		if (this.options.loop) {
			this.loop()
		}
	}

	bindEvents = () => {
		if (this.$buttonPrevious) {
			this.$buttonPrevious.addEventListener('click', this._onClickPrev)
		}

		if (this.$buttonNext) {
			this.$buttonNext.addEventListener('click', this._onClickNext)
		}
	}

	_onClickPrev = e => {
		e.preventDefault()
		this.previous()
		this.trigger('previous', this.currentItemIndex)
	}

	_onClickNext = e => {
		e.preventDefault()
		this.next()
		this.trigger('next', this.currentItemIndex)
	}

	goTo = index => {
		if (index === this.currentItemIndex) {
			return
		}

		const prev = this.currentItemIndex

		// Fix the index if it's out of bounds and carousel is enabled
		index = index === -1 && this.options.carousel ? this.lastItemIndex : index
		index =
			index === this.lastItemIndex + 1 && this.options.carousel ? 0 : index

		// Exit when index is out of bounds
		if (index < 0 || index > this.lastItemIndex) {
			return
		}

		this.removeAllHelperSettings()

		let isForwards =
			(index > this.currentItemIndex ||
				(index === 0 && this.currentItemIndex === this.lastItemIndex)) &&
			!(index === this.lastItemIndex && this.currentItemIndex === 0)

		this.$nodes[this.currentItemIndex].classList.add(
			isForwards ? this.options.hidePreviousClass : this.options.hideNextClass
		)

		this.$nodes[index].classList.add(
			this.options.currentItemClass,
			isForwards ? this.options.showNextClass : this.options.showPreviousClass
		)

		this.currentItemIndex = index

		this.updateButtonStates()

		if (this.options.pager) {
			this.updatePagerLinks(this.currentItemIndex, index)
		}

		if (this.options.loop) {
			this.cancelLoop()
			this.loop()
		}

		this.trigger('change', {
			index,
			isForwards,
			prev,
			$node: this.$nodes[index]
		})
	}

	previous = () => this.goTo(this.currentItemIndex - 1)

	next = () => this.goTo(this.currentItemIndex + 1)

	reset = () => {
		this.$nodes = [...this.$el.querySelectorAll(`.${this.options.itemClass}`)]

		this.currentItemIndex = this.$nodes.indexOf(
			this.$el.querySelector(`.${this.options.currentItemClass}`)
		)
		this.lastItemIndex = this.$nodes.length - 1
	}

	destroy = () => {
		if (this.$buttonPrevious) {
			this.$buttonPrevious.removeEventListener('click', this._onPrevNext)
		}

		if (this.$buttonNext) {
			this.$buttonNext.removeEventListener('click', this._onClickNext)
		}

		if (this.options.pager) {
			this.removePagerEvents()
			this.$pagerWrapper.parentNode.removeChild(this.$pagerWrapper)
		}

		if (this.options.loop) {
			this.cancelLoop()
		}

		if (this.options.swipe) {
			this.mc.destroy()
		}

		this.removeAllHelperSettings()
		this.$nodes = []
		this.currentItemIndex = null
		this.lastItemIndex = null
	}

	updateButtonStates = () => {
		if ((!this.$buttonPrevious && !this.$buttonNext) || this.options.carousel) {
			return
		}

		if (this.currentItemIndex === this.lastItemIndex) {
			this.$buttonNext.setAttribute('disabled', 'disabled')
		} else if (this.currentItemIndex === 0) {
			this.$buttonPrevious.setAttribute('disabled', 'disabled')
		}
	}

	removeAllHelperSettings = () => {
		const {
			currentItemClass,
			hidePreviousClass,
			hideNextClass,
			showPreviousClass,
			showNextClass
		} = this.options

		this.$nodes[this.currentItemIndex].classList.remove(currentItemClass)

		this._removeMatchingClass(hidePreviousClass)
			._removeMatchingClass(showPreviousClass)
			._removeMatchingClass(hideNextClass)
			._removeMatchingClass(showNextClass)

		if (!this.$buttonPrevious && !this.$buttonNext) {
			return
		}

		this.$buttonPrevious.removeAttribute('disabled')
		this.$buttonNext.removeAttribute('disabled')
	}

	_removeMatchingClass = className => {
		const $node = this.$el.querySelector(`.${className}`)
		if (!$node) return this
		$node.classList.remove(className)
		return this
	}

	/**
	 *
	 * @function renderPager
	 * @return Slide
	 */
	renderPager = () => {
		const {
			pagerWrapper,
			pagerItem,
			pagerActiveClass,
			pagerContainer
		} = this.options
		const $parent = pagerContainer ? pagerContainer : this.$el
		this.$pagerWrapper = $parent.appendChild(domify(pagerWrapper))
		this.$pagerWrapper.appendChild(
			domify(this.$nodes.map(() => pagerItem).join(''))
		)
		this.$buttons = [...this.$pagerWrapper.children].map(($button, index) => {
			$button.setAttribute('data-index', index)
			if (index === this.currentItemIndex) {
				$button.classList.add('is-current')
			}
			return $button
		})

		this.$buttons[this.currentItemIndex].classList.add(pagerActiveClass)

		this.addPagerEvents()

		return this
	}

	/**
	 * Pager click event
	 * @function onPagerClick
	 * @param {Object} evt
	 * @return void
	 */
	onPagerClick = evt => {
		evt.preventDefault()
		const { currentTarget } = evt
		const { index } = currentTarget.dataset
		this.goTo(parseInt(index))
	}

	/**
	 * Bind pager events
	 * @function addPagerEvents
	 * @return Slide
	 */
	addPagerEvents = () => {
		this.$buttons.forEach(button =>
			button.addEventListener('click', this.onPagerClick)
		)
	}

	/**
	 * Remove pager events
	 * @function removePagerEvents
	 * @return Slide
	 */
	removePagerEvents = () => {
		this.$buttons.forEach(button =>
			button.removeEventListener('click', this.onPagerClick)
		)
	}

	/**
	 * Update the pager elements
	 * @function updatePagerLinks
	 * @param {Number} prev
	 * @param {Number} next
	 * @return void
	 */
	updatePagerLinks = (prev, next) => {
		const { pagerActiveClass } = this.options

		this.$buttons[prev].classList.remove(pagerActiveClass)
		this.$buttons[next].classList.add(pagerActiveClass)
	}

	/**
	 * loop through the slides
	 * @function loop
	 * @return void
	 */
	loop = () => {
		this.timeout = setTimeout(() => {
			this.handle = requestAnimationFrame(this.loop)
			this.next()
		}, this.options.delay)
	}

	/**
	 * cancel looping
	 * @function cancelLoop
	 * @return void
	 */
	cancelLoop = () => {
		cancelAnimationFrame(this.handle)
		clearTimeout(this.timeout)
	}

	/**
	 * add gestures
	 * @function addGestures
	 * @return void
	 */
	// addGestures = () => {
	// 	this.mc = new Hammer(this.$el)
	// 	this.mc.on('panend', this.onPanEnd)
	// }

	/**
	 * the gesture event
	 * @function onPanEnd
	 * @param {String} deconstructed event object
	 * @return void
	 */
	// onPanEnd = ({ additionalEvent }) => {
	// 	if (additionalEvent === 'panleft') {
	// 		this.previous()
	// 	} else if (additionalEvent === 'panright') {
	// 		this.next()
	// 	}
	// }
}
