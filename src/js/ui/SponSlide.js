import mitt from 'mitt'
import mapNodesToMachine from '@/utils/mapNodesToMachine'

export default class Slide {
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
		wrap: true
	}

	constructor($el) {
		this.events = mitt()
		this.$el = $el
		this.$slides = [...$el.querySelectorAll('[data-slide-item]')]
		this.wrap = true
		this.currentIndex = this.$slides.findIndex(node =>
			node.classList.contains('is-current')
		)

		this.machine = mapNodesToMachine(this.$slides, this.wrap)
		this.$prevBtn = $el.querySelector('[data-slide-prev]')
		this.$nextBtn = $el.querySelector('[data-slide-next]')

		this.goTo(0)
	}

	init = () => {
		this.$prevBtn.addEventListener('click', this.prev)
		this.$nextBtn.addEventListener('click', this.next)
	}

	update = state => {
		this.currentState = state
		return this
	}

	transition = (state, action) => {
		const newState = this.machine[state][action]
		this.goTo(newState.index)
	}

	prev = () => {
		this.transition(this.currentIndex, 'PREV')
	}

	next = () => {
		this.transition(this.currentIndex, 'NEXT')
	}

	goTo = state => {
		this.currentIndex = state

		this.$slides[0].innerHTML = `<pre class="text-sm">${JSON.stringify(
			this.machine[state],
			null,
			2
		)}</pre>`
	}
}
