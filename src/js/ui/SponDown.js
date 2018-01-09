import Flip from 'flipping/dist/flipping.web'

class DropDown {
	constructor($node) {
		this.$node = $node
		this.$button = this.$node.querySelector('[data-dropdown-button]')
		this.$content = this.$node.querySelector('[data-dropdown-menu]')

		this.flip = new Flip({
			parentElement: this.$node,
			duration: 1000,
			activeSelector: () => {
				return this.$content
			}
		})

		this.machine = {
			add: { CLICK: 'remove' },
			remove: { CLICK: 'add' }
		}

		this.state = this.$content.classList.contains('hidden') ? 'add' : 'remove'
	}

	init = () => {
		this.$button.addEventListener('click', this.onClick)
	}

	destroy = () => {
		this.$button.removeEventListener('click', this.onClick)
	}

	onClick = () => {
		this.state = this.machine[this.state].CLICK
		this.$button.classList[this.state]('is-open')
		this.$content.classList[this.state]('hidden')
	}
}

export default class {
	constructor(el = '[data-ui="dropdown"]') {
		this.DropDowns = [...document.querySelectorAll(el)]
			.map($node => new DropDown($node))
			.forEach(DropDown => DropDown.init())
	}
}
