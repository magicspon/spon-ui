// @ts-check

/**
 * @function preventClick
 * @param {MouseEvent} e
 * @param {HTMLAnchorElement} node
 * @return {boolean}
 */

export function preventClick(e, node) {
	if (!window.history.pushState) return false

	const { href } = node
	// User
	if (!node || !href) return false

	// Middle click, cmd click, and ctrl click
	if (e.which > 1 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
		return false

	// Ignore target with _blank target
	if (node.target && node.target === '_blank') return false

	// Check if it's the same domain
	if (
		window.location.protocol !== node.protocol ||
		window.location.hostname !== node.hostname
	)
		return false

	// Ignore case when a hash is being tacked on the current URL
	if (href.indexOf('#') > -1) return false

	// Ignore case where there is download attribute
	if (node.getAttribute && typeof node.getAttribute('download') === 'string')
		return false

	if (node.hasAttribute('data-no-route')) return false

	return true
}

/**
 * @function getKey
 * @param {HTMLElement} context
 * @return {(string|boolean)}
 */
export function getKey(context) {
	/** @type {HTMLElement} */
	const target = context.querySelector('[data-route]')
	if (!target) return false

	const { route: transitionName } = target.dataset
	const key =
		typeof transitionName === 'string' && transitionName.length > 0
			? transitionName
			: false
	return key
}

/**
 * @function fetcher
 * @param {string} path
 * @return {Promise<array>}
 */
export async function fetcher(path) {
	const arr = []

	await fetch(path)
		.then(resp => {
			if (!resp.ok) {
				arr[1] = resp.status
			}
			return resp
		})
		.then(resp => resp.text())
		.then(resp => {
			arr[0] = resp
		})
		.catch(e => {
			console.log('error:', e)
		})

	return arr
}

/**
 * @function getTransition
 * @param {object} transitions
 * @return {function}
 */
export function getTransition(transitions) {
	/**
	 * @typedef {Object} TransitionObject
	 * @property {string} name add delegated events
	 * @property {object} transition remove event by key
	 */
	/**
	 *
	 * @param {string} key
	 * @param {string} pathname
	 * @return {TransitionObject}
	 */
	function pluckTransition(key, pathname) {
		const name = key || pathname || 'default'
		return {
			name,
			transition: transitions[key || pathname] || transitions.default
		}
	}

	return pluckTransition
}

/**
 * @typedef {Object} TransitionManger
 * @property {function} dispatch dispatch a page transition
 * @property {function} getState get the current transition state
 */

/**
 * @function createStore
 * @param {object} initialStore
 * @param {object} initialStore.current
 * @param {object} initialStore.current.params
 * @param {string} initialStore.current.html
 * @param {object} initialStore.current.key
 * @param {object} initialStore.prev
 * @return {TransitionManger}
 */
export function createStore(
	initialStore = {
		current: {
			params: {},
			html: '',
			key: null
		},
		prev: {}
	}
) {
	let store = { ...initialStore, cache: {} }

	/**
	 * @function setPage
	 * @param {object} payload
	 * @return {void}
	 */
	function setPage(payload) {
		const { cache, current } = store
		store = {
			cache: {
				...cache,
				[payload.params.href]: payload
			},
			prev: current,
			current: payload
		}
	}

	return {
		/**
		 * @function dispatch
		 * @param {object} params
		 * @return {Promise}
		 */
		dispatch: async function dispatch(params) {
			const { href, key } = params

			const cached = store.cache[href]

			if (cached) {
				// debugger // eslint-disable-line
				setPage(cached)
				await Promise.resolve(cached)
				return
			}

			const [resp] = await fetcher(href)

			if (resp) {
				const data = {
					html: resp,
					key,
					params
				}

				setPage(data)
			} else {
				window.location = href
			}
		},

		/**
		 * @function getState
		 * @return {object}
		 */
		getState() {
			return store
		}
	}
}

/**
 * @typedef {Object} Stack
 * @property {function} push add an item to the stack
 * @property {function} pop pop off the last item from the stack
 * @property {function} peek return the last item in the stack
 * @property {number} length get the current stack length
 * @property {array} stack get the current stack
 * @property {function} isEmpty returns a boolean
 */

/**
 * @function createStack
 * @return {Stack}
 */
export function createStack() {
	const stack = []

	return {
		push(item) {
			stack.push(item)
		},

		pop() {
			return stack.pop()
		},

		peek() {
			return stack[stack.length - 1]
		},

		get length() {
			return stack.length
		},

		isEmpty() {
			return stack.length === 0
		},

		get stack() {
			return stack
		}
	}
}
