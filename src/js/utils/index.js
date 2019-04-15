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
	/**
	 * get the href from the button
	 *
	 * @private
	 * @type {String}
	 */
	const targetSelector = node.getAttribute('href')

	/**
	 * remove the hash
	 *
	 * @private
	 * @type {String}
	 */
	const id = targetSelector.split('#').pop()

	return id
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

// export default R.memoizeWith(R.identity, (type = 'transition') => {
// const types =
// 	type === 'transition'
// 		? {
// 			OTransition: 'oTransitionEnd',
// 			WebkitTransition: 'webkitTransitionEnd',
// 			MozTransition: 'transitionend',
// 			transition: 'transitionend'
// 		}
// 		: {
// 			OAnimation: 'oAnimationEnd',
// 			WebkitAnimation: 'webkitAnimationEnd',
// 			MozAnimation: 'animationend',
// 			animation: 'animationend'
// 		}

// 	const elem = document.createElement('div')

// return Object.keys(types).reduce(
// 	(prev, trans) => (undefined !== elem.style[trans] ? types[trans] : prev),
// 	''
// )
// })
