// @ts-check

/**
 * @module plugin/resize
 */

/**
 * @function resize
 * @description Use the ResizeObsever
 * @see https://developers.google.com/web/updates/2016/10/resizeobserver
 * @property {object} props
 * @property {HTMLElement} props.node the root node to attach events to
 * @property {function} props.register a function used to store the destroy method
 * @return {resizeType}
 */

/**
 * @typedef {Object} resizeType
 * @property {Function} resize - plugin namespace
 */

/**
 * @typedef {Object} observerType
 * @property {Function} observe - plugin namespace
 * @property {Function} disconnect - plugin namespace
 */

export default function resize({ node, register }) {
	let ro

	register(() => {
		if (ro) {
			ro.disconnect()
		}
	})

	return {
		/**
		 * @method resize
		 * @memberof resize
		 * @description Create a resize observer on the provided node
		 * @param {HTMLElement} element
		 * @return {observerType}
		 */
		resize(element = node) {
			return {
				/**
				 * @method observe
				 * @memberof resize
				 * @description start observing events, and call the provided callback function on change
				 * @param {function} callback
				 * @return {void}
				 */
				observe(callback) {
					if ('ResizeObserver' in window) {
						// @ts-ignore
						ro = new ResizeObserver(entries => {
							Object.values(entries).forEach(value => {
								callback(value)
							})
						})

						ro.observe(element)
					} else {
						callback()
					}
				},
				/**
				 * @method disconnect
				 * @memberof resize
				 * @description remove the resize mutation observer
				 * @return {void}
				 */
				disconnect() {
					if (ro) {
						ro.disconnect()
					}
				}
			}
		}
	}
}
