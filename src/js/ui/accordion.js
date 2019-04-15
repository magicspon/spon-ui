// @ts-check
import { eventBus, addEventPromise } from '@spon/core'
import toggle from './toggle'
import { renderInTheLoop, getIdFromHref, getEventName } from '@/utils'

/**
 * @module ui/accordion
 */

/**
 * @function accordion
 * @param props
 * @example
 * <div id="steps" data-behaviour="steps">
 *   <a data-accordion-button href="#step-1">button</a>
 *   <div id="step-1" data-accordion-panel>content</div>
 *   <a data-accordion-button href="#step-2">button</a>
 *   <div id="step-2" data-accordion-panel>content</div>
 * </div>
 * @property {HTMLElement} props.node the html element to query from
 * @property {Boolean} props.closeOthers only allow one item to be open at a time
 * @property {String} props.namespace
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

function accordion({ node, closeOthers = true, namespace }) {
	/**
	 * Build an array of panes... each pane is a toggle function
	 *
	 * @private
	 * @type {Object}
	 */
	const panes = [...node.querySelectorAll('[data-accordion-button]')].reduce(
		(acc, button) => {
			const targetId = getIdFromHref(button)
			return {
				...acc,
				[targetId]: toggle({
					button,
					closeOnBlur: false,
					name: `${targetId}`
				})
			}
		},
		{}
	)

	const onHandles = []

	/**
	 * @function open
	 * @memberof accordion
	 * @param {string} name id of the pane to open
	 * @return {void}
	 */
	function open(name) {
		panes[name].open()
	}

	/**
	 * @function close
	 * @memberof accordion
	 * @param {string} name id of the pane to open
	 * @return {void}
	 */
	function close(name) {
		panes[name].open()
	}

	/**
	 * @function openAll
	 * @memberof accordion
	 * @return {void}
	 */
	function openAll() {
		Object.values(panes).forEach(pane => {
			pane.open()
		})
	}

	/**
	 * @function closeAll
	 * @memberof accordion
	 * @return {void}
	 */
	function closeAll() {
		Object.values(panes)
			.filter(pane => pane.isOpen)
			.forEach(pane => {
				pane.close()
			})
	}

	/**
	 *
	 * @param {Object} props
	 * @property {HTMLElement} props.target
	 * @return {void}
	 */
	function openPane({ target, pane }) {
		if (closeOthers) {
			closeAll()
		}
		target.style.display = 'block'
		const { height } = target.getBoundingClientRect()
		target.style.height = '0px'

		renderInTheLoop(() => {
			addEventPromise(getEventName('transitionend'), target, () => {
				target.style.height = `${height}px`
			}).then(() => {
				target.style.height = ''
				pane.isOpen = true

				eventBus.emit(`@${namespace}:accordion/open`, { target, pane })
			})
		})

		target.focus()
	}

	/**
	 *
	 * @param {Object} props
	 * @property {HTMLElement} props.target
	 * @return {void}
	 */
	function closePane({ target, pane }) {
		const { height } = target.getBoundingClientRect()
		target.style.height = `${height}px`

		renderInTheLoop(() => {
			addEventPromise(getEventName('transitionend'), target, () => {
				target.style.height = 0
			}).then(() => {
				target.style.height = ''
				target.style.display = 'none'
				pane.isOpen = false

				eventBus.emit(`@${namespace}:accordion/close`, { target, pane })
			})
		})
	}

	/**
	 * @function init
	 * @memberof accordion
	 * @return {void}
	 */
	function init() {
		Object.entries(panes).forEach(([key, pane]) => {
			pane.init()

			const openFn = ({ target }) => openPane({ target, pane })
			const closeFn = ({ target }) => closePane({ target, pane })

			pane.on(`open:${key}`, openFn)
			pane.on(`close:${key}`, closeFn)

			onHandles.push([`open:${key}`, openFn], [`close:${key}`, closeFn])
		})
	}

	function destroy() {
		Object.values(panes).forEach(pane => pane.destroy())
		onHandles.forEach(([event, fn]) => eventBus.off(`${event}`, fn))
	}

	return {
		init,
		destroy,
		open,
		close,
		openAll,
		closeAll,
		on(event, fn) {
			eventBus.on(`@${namespace}:${event}`, fn)
			onHandles.push([`@${namespace}:${event}`, fn])
		}
	}
}

export default accordion
