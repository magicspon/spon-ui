// @ts-check
/**
 * @module plugin/inview
 */

/**
 * @typedef {Object} inviewType
 * @property {Object} inview - plugin namespace
 * @property {Object} inview.settings - The resize funciton
 * @property {Function} inview.observe - The resize funciton
 * @property {Function} inview.disconnect - The resize funciton
 */

/**
 * @function inview
 * @property {object} props
 * @property {HTMLElement} props.node the root node to attach events to
 * @property {function} props.register a function used to store the destroy method
 * @return {inviewType}
 */
export default function inview({ register, node }) {
	let observer

	const defaults = {
		rootMargin: '0px',
		threshold: 0
	}

	register(() => {
		if (observer) {
			observer.disconnect()
		}
	})

	return {
		inview: {
			settings: {},

			/**
			 * @memberof inview
			 * @method observe
			 * @param  {...any} args
			 * @return {void}
			 */
			observe(...args) {
				const target = args.length > 1 ? args[0] : node
				const fn = args.length > 1 ? args[1] : args[0]

				const { enter, exit } = fn

				observer = new IntersectionObserver(
					(entries, observer) => {
						entries.forEach(entry => {
							if (entry.isIntersecting) {
								if (typeof enter === 'function') {
									enter(entry, observer)
								}
							} else {
								if (typeof exit === 'function') {
									exit(entry, observer)
								}
							}
						})
					},
					{
						...defaults,
						...this.settings
					}
				)

				if (typeof target.length === 'number') {
					;[...target].forEach(node => {
						observer.observe(node)
					})
				} else {
					observer.observe(target)
				}
			},

			/**
			 * @memberof inview
			 * @method disconnect
			 * @return {void}
			 */
			disconnect: () => {
				observer.disconnect()
			}
		}
	}
}
