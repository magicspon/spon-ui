import mitt from 'mitt'
import mapNodesToMachine from '@/utils/mapNodesToMachine'
import domify from 'domify'
import eventPromise from '@/utils/eventPromise'
import animationEnd from '@/utils/animationEnd'

export default class Slide {
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
		promiseBefore: false,
		paginationParent: false,
		paginationWrapper:
			'<div class="absolute w-full pin-t z-10 flex justify-center"></div>',
		paginationButtons: slides => slides.map(() => '<button>&#9679</button>')
	}

	constructor($el, options = {}) {
		this.options = { ...this.defaults, ...options }

		const { selector, previousButton, nextButton, animationType } = this.options

		this.wrap = this.options.wrap
		this.dots = this.options.wrap
		this.events = mitt()
		this.$el = $el
		this.$slides = [...$el.querySelectorAll(selector)]
		this.total = this.$slides.length - 1
		this.currentIndex = 0
		this.$prevBtn = previousButton && $el.querySelector(previousButton)
		this.$nextBtn = nextButton && $el.querySelector('[data-slide-next]')
		this.animationEvent = animationEnd(animationType)

		this.handle
		this.timer
	}

	setOptions = (options = {}) => {
		this.options = { ...this.options, options }
		return this
	}

	init = () => {
		const { activeClass, loop } = this.options
		const $item = this.$el.querySelector(`.${activeClass}`)

		!$item && this.$slides[0].classList.add(activeClass)

		this.machine = mapNodesToMachine(this.$slides, this.wrap)
		this.$prevBtn && this.$prevBtn.addEventListener('click', this.prev)
		this.$nextBtn && this.$nextBtn.addEventListener('click', this.next)

		this.renderPager(this.currentIndex)
		if (loop) this.loop()
		return this
	}

	reset = () => {
		const { selector, activeClass, loop } = this.option
		const i = this.$nodes.indexOf(this.$el.querySelector(`.${activeClass}`))
		if (loop) this.cancelLoop()
		this.currentIndex = i > -1 ? i : 0
		this.$slides = [...this.$el.querySelectorAll(selector)]
		this.total = this.$slides.length - 1
		this.machine = mapNodesToMachine(this.$slides, this.wrap)
		return this
	}

	destroy = () => {
		const { activeClass, loop } = this.option
		if (loop) this.cancelLoop()

		if (this.$prevBtn) {
			this.$prevBtn.removeEventListener('click', this.prev)
			this.$prevBtn.removeAttribute('disabled')
		}

		if (this.$nextBtn) {
			this.$nextBtn.removeEventListener('click', this.next)
			this.$nextBtn.removeAttribute('disabled')
		}

		if (this.dots) {
			this.$pagerButtons.forEach(node =>
				node.removeEventListener('click', this.onPagerClick)
			)
			this.$pagerWrapper.parentNode.removeChild(this.$pagerWrapper)
		}

		this.$slides[this.currentIndex].classList.remove(activeClass)
		this.$slides.forEach(node => node.setAttribute('data-slide-item'))

		this.events.off('*')
		return this
	}

	transition = (state, action) => {
		const newState = this.machine[state][action]
		this.goTo(newState.index)
	}

	prev = e => {
		e && e.preventDefault()
		this.events.emit('change:prev')
		this.transition(this.currentIndex, 'PREV')
	}

	next = e => {
		e && e.preventDefault()
		this.events.emit('change:next')
		this.transition(this.currentIndex, 'NEXT')
	}

	before = props => {
		const { promiseBefore } = this.options
		if (!promiseBefore) return Promise.resolve()
		return new Promise(resolve => {
			this.events.emit('slide:before', { props, resolve })
		})
	}

	goTo = state => {
		if (this.currentIndex === state || this.isRuning) return
		this.isRuning = true
		const { activeClass, loop } = this.options
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

		if (loop) this.cancelLoop()

		this.events.emit('slide:change', beforeProps)

		this.before({
			...beforeProps
		}).then(() => {
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
				this.events.emit('slide:after', props)
			})

			eventPromise(this.animationEvent, $next, () => {
				$next.classList.add(activeClass)
				$next.setAttribute(
					'data-slide-item',
					forwards ? 'show-next' : 'show-prev'
				)
				this.dots && this.updatePagerButtons(state)
				this.currentIndex = state
			})

			this.isRuning = false
			if (loop) this.loop()
		})
	}

	onPagerClick = state => {
		this.updatePagerButtons(state)
		this.goTo(state)
	}

	updatePagerButtons = state => {
		this.$pagerButtons[this.currentIndex].setAttribute('data-slide-pager', '')
		this.$pagerButtons[state].setAttribute('data-slide-pager', 'active')
	}

	renderPager = state => {
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
				html.addEventListener('click', this.onPagerClick.bind(this, index))
				return html
			})

		this.$pagerWrapper.appendChild(
			this.$pagerButtons.reduce((acc, item) => {
				acc.appendChild(item)
				return acc
			}, document.createDocumentFragment())
		)
	}

	loop = () => {
		const { delay } = this.options
		this.timer = setTimeout(() => {
			this.handle = requestAnimationFrame(this.loop)
			this.next()
		}, delay)
	}

	cancelLoop = () => {
		cancelAnimationFrame(this.handle)
		clearTimeout(this.timetimerout)
	}
}
