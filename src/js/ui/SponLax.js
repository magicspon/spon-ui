export default class SponLax {
	defaults = {
		rootMargin: '0px',
		threshold: 0,
		shouldUnObserve: () => false,
		observerLoop({ $node }) {
			const { top } = $node.getBoundingClientRect()
			const { speed } = $node.dataset
			$node.style.transform = `translate3d(0, ${top * parseFloat(speed)}px, 0)`
		}
	}

	prevFrame = -1

	constructor(selector = '[data-inview]', options = {}) {
		this.nodes = [...document.querySelectorAll(selector)].map((node, index) => {
			node.setAttribute('data-key', index)
			return node
		})

		this.options = { ...this.defaults, ...options }

		const { rootMargin, threshold } = this.options
		const observer = new IntersectionObserver(this.onIntersection(), {
			rootMargin,
			threshold
		})

		this.nodes.forEach($node => observer.observe($node))

		this.blobs = []
		this.handle = null
	}

	within = node => node.getAttribute('data-inview') === 'true'
	markAsWithin = node => node.setAttribute('data-inview', 'true')
	markAsNotWithin = node => node.setAttribute('data-inview', 'false')

	loop = () => {
		const { observerLoop } = this.options

		if (window.pageYOffset === this.prevFrame) {
			this.handle = requestAnimationFrame(this.loop)
			return
		}

		this.prevFrame = window.pageYOffset
		this.blobs.forEach(observerLoop)
		this.handle = requestAnimationFrame(this.loop)
	}

	onIntersection = () => (entries, observer) => {
		const { shouldUnObserve } = this.options

		entries.forEach(entry => {
			const { target: $node, isIntersecting } = entry

			if (isIntersecting) {
				if (shouldUnObserve($node)) {
					observer.unobserve($node)
				}
				if (!this.within($node)) {
					this.markAsWithin($node)
				}
			} else {
				if (this.within($node)) {
					this.markAsNotWithin($node)
				}
			}

			this.blobs = this.nodes
				.filter(this.within)
				.map($node => ({ $node, entry }))
		})

		if (this.blobs.length > 0 && this.handle === null) {
			this.loop()
		}

		if (this.blobs.length === 0) {
			cancelAnimationFrame(this.handle)
			this.handle = null
		}
	}
}
