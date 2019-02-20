// @ts-check

/**
 * @function connect
 * @memberOf connect
 * @param {Function} registerPlugins either the mapState function or an object with state/dispatch methods
 * @return {function}
 */

export default function bindPlugins(registerPlugins) {
	return function withPlugins(...plugins) {
		/**
		 * @param {function} module the module to bind to
		 * @memberOf connect
		 * @return {function}
		 */
		return module => {
			return ({ key, ...props }) =>
				module({
					...props,
					plugins: {
						...plugins.reduce(
							(acc, curr) => ({
								...acc,
								...curr({
									register: registerPlugins(key),
									...props
								})
							}),
							{}
						)
					}
				})
		}
	}
}
