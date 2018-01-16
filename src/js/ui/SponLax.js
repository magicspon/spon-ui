export default class SponLax {
	defaults = {
		rootMargin: '0px',
		threshold: 0,
		shouldUnObserve: () => false,
		onEnter: () => {},
		onLeave: () => {},
		inview: () => {}
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

		this.blobs = new Set()
		this.handle = null
		this.prevFrame = undefined
	}

	within = node => node.getAttribute('data-inview') === 'true'

	markAsWithin = node => node.setAttribute('data-inview', 'true')

	markAsNotWithin = node => node.setAttribute('data-inview', 'false')

	loop = () => {
		if (this.y === this.prevFrame) {
			this.handle = requestAnimationFrame(this.loop)
			return
		}

		this.prevFrame = this.y

		const { inview } = this.options
		;[...this.blobs].forEach(inview)
		this.handle = requestAnimationFrame(this.loop)
	}

	update = y => {
		this.y = y || window.pageYOffset
	}

	onIntersection = () => (entries, observer) => {
		const { shouldUnObserve, onEnter, onLeave } = this.options

		entries.forEach(entry => {
			const { target: $node, isIntersecting } = entry

			if (isIntersecting) {
				if (shouldUnObserve($node)) {
					observer.unobserve($node)
				}

				this.blobs.add($node)
				onEnter($node)

				!this.within($node) && this.markAsWithin($node)
			} else {
				this.within($node) && this.markAsNotWithin($node)
				const { onLeave } = this.options
				onLeave($node)

				this.blobs.delete($node)
			}
		})

		if (this.blobs.size > 0 && this.handle === null) {
			this.loop()
		}

		if (this.blobs.length === 0) {
			cancelAnimationFrame(this.handle)
			this.handle = null
		}
	}
}
