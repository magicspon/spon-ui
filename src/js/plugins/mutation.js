// @ts-check

/**
 * @module plugin/mutation
 */

/**
 * @function mutation
 * @description Use the MutationObserver
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
 * @property {object} props
 * @property {HTMLElement} props.node the root node to attach events to
 * @property {function} props.register a function used to store the destroy method
 * @return {mutationType}
 */

/**
 * @typedef {Object} mutationType
 * @property {Function} mutation - plugin namespace
 */

/**
 * @typedef {Object} observerType
 * @property {Function} observe - plugin namespace
 * @property {Function} disconnect - plugin namespace
 */

export default function mutation({ node, register }) {
	let ro

	register(() => {
		if (ro) {
			ro.disconnect()
		}
	})

	return {
		/**
		 * @method mutation
		 * @memberof mutation
		 * @description Create a mutation observer on the provided node
		 * @param {HTMLElement} element
		 * @return {observerType}
		 */
		mutation(
			element = node,
			config = { attributes: true, childList: false, subtree: false }
		) {
			return {
				/**
				 * @method observe
				 * @memberof mutation
				 * @description start observing events, and call the provided callback function on change
				 * @param {function} callback
				 * @return {void}
				 */
				observe(callback) {
					if ('MutationObserver' in window) {
						// @ts-ignore
						ro = new MutationObserver(entries => {
							Object.values(entries).forEach(value => {
								callback(value)
							})
						})

						ro.observe(element, config)
					} else {
						callback()
					}
				},
				/**
				 * @method disconnect
				 * @memberof mutation
				 * @description remove the mutation mutation observer
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
