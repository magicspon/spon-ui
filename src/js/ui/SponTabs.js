import mitt from 'mitt'

/*
	Options:

	selector: {String} - css selector
	activeClass: {String} - class name

	Events: 
	Called in order
	const $n = new Slide($HTML, {})

	$n.emitter('spon:change') - on change

	API:

	$n.init() - start
	$n.goTo(index) - Number
	$n.destroy() - start

	HTML:

<div class="c-tabs" data-ui="tabs">
  <div>
    <a data-tab-button href="#tab-1" class="no-underline block p-2 bg-grey-lighter hover:bg-grey text-black hover:text-grey-darkest">Tab {{ i }}</a>
    <a data-tab-button href="#tab-2" class="no-underline block p-2 bg-grey-lighter hover:bg-grey text-black hover:text-grey-darkest">Tab {{ i }}</a>
    <a data-tab-button href="#tab-3" class="no-underline block p-2 bg-grey-lighter hover:bg-grey text-black hover:text-grey-darkest">Tab {{ i }}</a>
  </div>
  <div data-tab-container class="c-tabs__container relative overflow-hidden">
    <div data-tab-item id="tab-1" class="c-tabs__item {{ loop.index == 1 ? 'c-tab__item--active' : '' }} absolute invisible pointer-events-none pin">
      content
    </div>
    <div data-tab-item id="tab-2" class="c-tabs__item {{ loop.index == 1 ? 'c-tab__item--active' : '' }} absolute invisible pointer-events-none pin">
      content
    </div>
    <div data-tab-item id="tab-3" class="c-tabs__item {{ loop.index == 1 ? 'c-tab__item--active' : '' }} absolute invisible pointer-events-none pin">
      content
    </div>
  </div>
</div>

*/

export default class {
	defaults = {
		selector: '[data-tab-item]',
		activeClass: 'c-tab__item--active'
	}

	constructor($el, options = {}) {
		this.options = { ...this.defaults, ...options }
		this.emitter = mitt()
		this.$el = $el
	}

	init = () => {
		const { selector, activeClass } = this.options
		this.currentIndex = undefined
		this.$tabs = [...this.$el.querySelectorAll(selector)].map(
			($node, index) => {
				if ($node.classList.contains(activeClass)) this.currentIndex = index
				const $button = this.$el.querySelector(
					`a[href="#${$node.getAttribute('id')}"]`
				)
				$node.setAttribute('data-key', index)
				$button.setAttribute('data-key', index)
				$button.addEventListener('click', this._onClick.bind(this, index))
				return {
					$node,
					$button
				}
			}
		)
	}

	destroy = () => {
		this.$tabs.forEach(({ $button }, index) => {
			$button.removeAttribute('click', this._onClick.bind(this, index))
		})
	}

	_onClick = (index, event) => {
		event.preventDefault()
		this.goTo(index)
	}

	goTo = index => {
		const { activeClass } = this.options
		const { $node: $currentTab, $button: $currentButton } = this.$tabs[
			this.currentIndex
		]
		const { $node: $nextTab, $button: $nextButton } = this.$tabs[index]

		$currentTab.classList.remove(activeClass)
		$currentButton.classList.remove(activeClass)

		$nextTab.classList.add(activeClass)
		$nextButton.classList.add(activeClass)

		this.emitter.emit('spon:change')

		this.currentIndex = index
	}
}
