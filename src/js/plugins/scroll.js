// @ts-check
import throttle from 'raf-throttle'
import { eventBus } from '@spon/core'

/**
 * @module plugin/scroll
 */

// an object to store all the resize handles
const handles = {}
let yOffset = -1
let timer
let isScrolling = false

/**
 * @memberOf scroll
 * @function addWindowScrollEvent
 * @description Adds a window scroll event event, and calls each item in the handles stack
 * @param {function} fn
 * @param {string} key
 * @return {void}
 */
function addWindowScrollEvent(fn, key) {
	if (!handles[key]) {
		handles[key] = fn
	}
	if (!addWindowScrollEvent.isRunning) {
		const handle = throttle(() => {
			const entries = Object.values(handles)
			entries.forEach(() => {
				eventBus.emit('@scroll/progress', { y: yOffset })
			})

			if (!isScrolling) {
				eventBus.emit('@scroll/start', { y: yOffset })
			}

			isScrolling = true

			// clear any current timers
			clearTimeout(timer)

			timer = setTimeout(() => {
				if (yOffset === window.pageYOffset) {
					eventBus.emit('@scroll/stop', { y: yOffset })
					clearTimeout(timer)
					isScrolling = false
				}
			}, 100)

			yOffset = window.pageYOffset

			if (entries.length === 0) {
				window.removeEventListener('scroll', handle)
				addWindowScrollEvent.isRunning = false
			}
		})

		if (Object.entries(handles).length) {
			window.addEventListener('scroll', handle)
			addWindowScrollEvent.isRunning = true
		}
	}
}

/**
 *
 * @property {Boolean} isRunning
 */
addWindowScrollEvent.isRunning = false

/**
 * @memberOf device
 * @description remove event listeners
 * @param {Array} fns
 * @return {void}
 */
function removeWindowScrollEvent(fns) {
	fns.forEach(fn => {
		delete handles[fn]
	})
}

/**
 * @function scroll
 * @property {object} props
 * @property {string} props.name the module name
 * @property {Function} props.register a function used to store the destroy method
 * @return {scrollType}
 */

/**
 * @typedef {Object} scrollType
 * @property {Object} scroll - plugin namespace
 * @property {Function} scroll.progress - function called on scroll
 * @property {Function} scroll.start - function called when the user starts to scroll
 * @property {Function} scroll.stop - function called when a user stops scrolling
 * @property {Function} scroll.destroy - The resize funciton
 */
function scroll({ register, name }) {
	const localList = []

	register(() => {
		removeWindowScrollEvent(localList)
	})

	return {
		scroll: {
			/**
			 * @memberOf scroll
			 * @method watch
			 * @param {function} callback
			 * @return {Object}
			 */
			progress(callback) {
				localList.push(name)
				eventBus.on('@scroll/progress', callback)
				addWindowScrollEvent(callback, name)
				return this
			},

			/**
			 * @memberOf scroll
			 * @method start
			 * @param {function} callback
			 * @return {Object}
			 */
			start(callback) {
				localList.push(name)
				eventBus.on('@scroll/start', callback)
				addWindowScrollEvent(callback, name)
				return this
			},

			/**
			 * @memberOf scroll
			 * @method stop
			 * @param {function} callback
			 * @return {Object}
			 */
			stop(callback) {
				localList.push(name)
				eventBus.on('@scroll/stop', callback)
				addWindowScrollEvent(callback, name)
				return this
			},

			/**
			 * @memberOf scroll
			 * @method destroy
			 * @param {function} callback
			 * @return {Object}
			 */
			destroy() {
				removeWindowScrollEvent(localList)
				return this
			}
		}
	}
}

export default scroll
