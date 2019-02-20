// @ts-check

/**
 * @typedef {Object} CreateStoreFactory
 * @property {function} add add an item to the store
 * @property {function} set update an item in the store
 * @property {function} get get an item from the store
 * @property {function} has check to see if an item exists in the store
 * @property {function} delete remove an item from the store
 * @property {Object} store the current store
 */

/**
 * @function createStore
 * @return {CreateStoreFactory}
 */
export const createStore = () => {
	const store = {}

	return {
		/**
		 * @function add
		 * @param {string} key
		 * @param {object} value
		 * @return {void}
		 */
		add(key, value) {
			store[key] = value
		},

		/**
		 * @function set
		 * @param {string} key
		 * @param {object} value
		 * @return {void}
		 */
		set(key, value) {
			const item = store[key]
			store[key] = {
				...item,
				...value
			}
		},

		/**
		 * @function get
		 * @param {string} key
		 * @return {object}
		 */
		get(key) {
			return store[key]
		},

		/**
		 * @function has
		 * @param {string} key
		 * @return {boolean}
		 */
		has(key) {
			return !!store[key]
		},

		/**
		 * @function delete
		 * @param {string} key
		 * @return {void}
		 */
		delete(key) {
			delete store[key]
		},

		get store() {
			return store
		}
	}
}

/**
 * @function registerPlugins
 * @param {object} cache
 * @return {function}
 */
export function registerPlugins(cache) {
	/**
	 * @function setCacheKey
	 * @param {string} name
	 * @return {function}
	 */
	function setCacheKey(name) {
		/**
		 * @function setPlugin
		 * @param {object} plugin
		 * @return {void}
		 */
		//	debugger // eslint-disable-line
		function setPlugin(plugin) {
			const { plugins = [] } = cache.get(name)

			cache.set(name, {
				plugins: [...plugins, plugin]
			})
		}
		return setPlugin
	}

	return setCacheKey
}
