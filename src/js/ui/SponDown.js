class DropDown {
	constructor($node) {
		this.$node = $node
		this.$button = this.$node.querySelector('[data-dropdown-button]')
		this.$content = this.$node.querySelector('[data-dropdown-menu]')
	}

	init = () => {
		this.$button.addEventListener('click', this.onClick)
	}

	destroy = () => {
		this.$button.removeEventListener('click', this.onClick)
	}

	onClick = () => {
		this.$button.classList.toggle('is-open')
		this.$content.classList.toggle('hidden')
	}
}

export default class {
	constructor(el = '[data-dropdown]') {
		this.DropDowns = [...document.querySelectorAll(el)]
			.map($node => new DropDown($node))
			.forEach(DropDown => DropDown.init())
	}
}
