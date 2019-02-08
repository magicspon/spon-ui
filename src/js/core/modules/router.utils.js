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

export function getKey(context) {
	const target = context.querySelector('[data-route]')
	if (!target) return false

	const { route: transitionName } = target.dataset
	const key = transitionName.length > 0 ? transitionName : false
	return key
}

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
			log('error:', e)
		})

	return arr
}

export function getTransition(transitions) {
	return (key, pathname) => {
		const name = key || pathname || 'default'
		return {
			name,
			transition: transitions[key || pathname] || transitions.default
		}
	}
}

export function createStore(
	initialStore = {
		current: {
			params: {},
			html: null,
			key: null
		},
		prev: {}
	}
) {
	let store = { ...initialStore, cache: {} }

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

		getState() {
			return store
		}
	}
}
