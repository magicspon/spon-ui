import DomDelegate from 'dom-delegate'

class FancyNav {
	defaults = {
		selector: '[data-menu-item]',
		mask: '[data-menu-mask]'
	}

	constructor($node, options = {}) {
		this.$node = $node
		this.options = { ...this.defaults, ...options }

		this.$buttons = [...$node.querySelectorAll(this.options.selector)]
		this.$mask = $node.querySelector(this.options.mask)

		this.DomDelegate = new DomDelegate($node)
	}

	bindEvents = () => {
		this.DomDelegate.on(
			'mouseenter',
			this.options.selector,
			this.onMouseEnter,
			true
		)
		this.DomDelegate.on(
			'mouseleave',
			this.options.selector,
			this.onMouseLeave,
			true
		)
	}

	onMouseEnter = (e, $node) => {
		if ($node.classList.contains('trigger-enter')) return
		$node.classList.add('trigger-enter')
		setTimeout(
			() =>
				$node.classList.contains('trigger-enter') &&
				$node.classList.add('is-active'),
			150
		)

		const $dropdown = $node.querySelector('[data-drop-down]')

		const { height } = $dropdown.getBoundingClientRect()

		this.$mask.classList.add('is-open')
		this.$mask.style.height = `${height}px`
	}

	onMouseLeave = (e, $node) => {
		const $p = e.relatedTarget.closest('[data-menu-item]')
		if ($p === $node) return

		$node.classList.remove('trigger-enter', 'is-active')
		this.$mask.classList.remove('is-open')
		this.$mask.style.height = '1px'
	}

	init = () => {
		this.bindEvents()
		log('INIT')
	}
}

new FancyNav(document.getElementById('fny')).init()
