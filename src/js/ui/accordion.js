// @ts-check

import { eventBus } from '@spon/plugins'
import domEvents from '@spon/domevents'
import { expander } from '@/utils/a11y'
import {
	renderInTheLoop,
	getIdFromHref,
	getEventName,
	addEventPromise
} from '@/utils'
/**
 * @module ui/accordion
 */
/**
 * @function accordion
 * @example
 * <div id="steps" data-behaviour="steps">
 *   <a data-accordion-button href="#step-1">button</a>
 *   <div id="step-1" data-accordion-panel>content</div>
 *   <a data-accordion-button href="#step-2">button</a>
 *   <div id="step-2" data-accordion-panel>content</div>
 * </div>
 * @property {HTMLElement} props.node the html element to query from
 * @property {Boolean} props.closeOthers only allow one item to be open at a time
 * @property {String} props.name
 * @return {accordionType}
 */
/**
 * @typedef {Object} accordionType
 * @property {function} init - Bind the toggle events
 * @property {function} destroy - Destroy the toggle events and reset any state
 * @property {function} open - open item by name
 * @property {function} close - close item by name
 * @property {function} openAll - open all the panes
 * @property {function} closeAll - close all the panes
 * @property {function} on - eventBus on event
 */
function accordion({ node, closeOthers = true, name = 'acc' }) {
	const { addEvents, removeEvents } = domEvents(node)
	let onHandles = []

	/**
	 * Build an array of panes... each pane is a toggle function
	 *
	 * @private
	 * @type {Object}
	 */
	const panes = [...node.querySelectorAll('[data-accordion-button]')].map(
		button => {
			const targetId = getIdFromHref(button)
			const target = document.getElementById(targetId)
			expander.init({
				button,
				target,
				id: targetId
			})

			return {
				targetId,
				button,
				target,
				isOpen: false
			}
		}
	)

	const getPane = id => panes.find(({ targetId }) => targetId === id)
	/**
	 *
	 * @param {Object} props
	 * @property {HTMLElement} props.target
	 * @return {void}
	 */
	function closePane({ target, button }) {
		const { height } = target.getBoundingClientRect()
		target.style.height = `${height}px`

		target.classList.add('is-animating')
		renderInTheLoop(() => {
			addEventPromise(getEventName('transitionend'), target, () => {
				target.style.height = 0
			}).then(() => {
				target.style.height = ''
				target.style.display = 'none'
				eventBus.emit(`${name}:close`, {
					target,
					button
				})
				button.classList.remove('is-open')
				target.classList.remove('is-animating')
				expander.close({
					button,
					target
				})
			})
		})
	}
	/**
	 * @function closeAll
	 * @param {Array} items
	 * @return {void}
	 */
	function closeAll(items = panes) {
		items.forEach(closePane)
	}

	/**
	 *
	 * @param {Object} props
	 * @property {HTMLElement} props.target
	 * @return {void}
	 */
	function openPane({ target, button, targetId }) {
		if (closeOthers) {
			closeAll(
				panes
					.filter(item => item.targetId !== targetId)
					.filter(item => item.button.classList.contains('is-open'))
			)
		}
		target.classList.add('is-animating')
		target.style.display = 'block'
		const { height } = target.getBoundingClientRect()
		target.style.height = '0px'

		renderInTheLoop(() => {
			addEventPromise(getEventName('transitionend'), target, () => {
				target.style.height = `${height}px`
			}).then(() => {
				target.style.height = ''

				eventBus.emit(`${name}:open`, {
					target,
					button
				})

				button.classList.add('is-open')
				target.classList.remove('is-animating')
				target.focus()
				expander.open({
					button,
					target
				})
			})
		})
	}

	/**
	 * @function openAll
	 * @param {Array} items
	 * @return {void}
	 */
	function openAll(items = panes) {
		items.forEach(openPane)
	}

	/**
	 *
	 * @param {Event} e
	 * @param {HTMLElement} elm
	 * @return {void}
	 */
	function onClick(e, elm) {
		e.preventDefault()
		const { button, target, targetId } = getPane(getIdFromHref(elm))
		const isOpen = button.classList.contains('is-open')
		const isAnimating = target.classList.contains('is-animating')

		if (isAnimating) return

		if (isOpen) {
			closePane({
				button,
				target,
				targetId
			})
		} else {
			openPane({
				button,
				target,
				targetId
			})
		}
	}

	/**
	 * @function init
	 * @memberof accordion
	 * @return {void}
	 */
	function init() {
		addEvents({
			'click [data-accordion-button]': onClick
		})
	}

	/**
	 * @function open
	 * @memberof accordion
	 * @param {string} id id of the pane to open
	 * @return {void}
	 */
	function open(id) {
		openPane(getPane(id))
	}

	/**
	 * @function close
	 * @memberof accordion
	 * @param {string} id id of the pane to open
	 * @return {void}
	 */
	function close(id) {
		closePane(getPane(id))
	}

	function destroy() {
		onHandles.forEach(([event, fn]) => eventBus.off(event, fn))
		onHandles = []
		removeEvents()
	}

	return {
		init,
		destroy,
		open,
		close,
		openAll,
		closeAll,
		on(event, fn) {
			eventBus.on(`${name}:${event}`, fn)
			onHandles.push([`${name}:${event}`, fn])
		}
	}
}
export default accordion
