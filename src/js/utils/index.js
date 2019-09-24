/**
 * @module utils/renderInTheLoop
 */

/**
 * @function renderInTheLoop
 * @description fun with the event loop
 * @see https://www.youtube.com/watch?v=8aGhZQkoFbQ
 * @see https://www.youtube.com/watch?v=cCOL7MC4Pl0
 * @param {function} callback
 * @return {void}
 */
export function renderInTheLoop(callback) {
	requestAnimationFrame(() => {
		requestAnimationFrame(() => callback())
	})
}

/**
 * @module utils/getIdFromHref
 */

/**
 * @function getIdFromHref
 * @param {HTMLElement} node
 * @return {string}
 */
export function getIdFromHref(node) {
	return node
		.getAttribute('href')
		.split('#')
		.pop()
}

const eventCache = {}

export function getEventName(event) {
	if (event !== 'transitionend' || event !== 'animationend') return event

	if (eventCache[event]) return eventCache[event]

	const types =
		event === 'transitionend'
			? {
				OTransition: 'oTransitionEnd',
				WebkitTransition: 'webkitTransitionEnd',
				MozTransition: 'transitionend',
				transition: 'transitionend'
			  }
			: {
				OAnimation: 'oAnimationEnd',
				WebkitAnimation: 'webkitAnimationEnd',
				MozAnimation: 'animationend',
				animation: 'animationend'
			  }

	const elem = document.createElement('div')

	const name = Object.keys(types).reduce(
		(prev, trans) => (undefined !== elem.style[trans] ? types[trans] : prev),
		''
	)

	eventCache[event] = name

	return name
}

/**
 * @function addEventPromise
 * @param {string} event
 * @param {HTMLElement} element
 * @param {function} callback
 * @return {Promise}
 */
export function addEventPromise(event, element, callback) {
	return new Promise(resolve => {
		function done() {
			element.removeEventListener(event, done)
			resolve()
		}

		element.addEventListener(event, done)
		callback()
	})
}
