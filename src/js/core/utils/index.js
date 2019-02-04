import { diff } from 'deep-object-diff'
import sync from 'framesync'

export const createStore = () => {
	const store = {}

	return {
		add(key, value) {
			store[key] = value
		},

		set(key, value) {
			const item = store[key]
			store[key] = {
				...item,
				...value
			}
		},

		get(key) {
			return store[key]
		},

		has(key) {
			return !!store[key]
		},

		delete(key) {
			delete store[key]
		},

		get store() {
			return store
		}
	}
}

const mapStateToRenderHelper = (state, watch) =>
	watch.length > 0
		? watch.reduce((acc, key) => {
			const path = key.split('/')
			if (path.length > 1) {
				const [root, child] = path

				acc[root] = {
					[child]: state[root][[child]]
				}
			} else {
				acc[path[0]] = state[path[0]]
			}

			return acc
		  }, {})
		: state

const mapStateToRender = (prevState, current, watch) => ({
	prev: mapStateToRenderHelper(prevState, watch),
	current: mapStateToRenderHelper(current, watch)
})

export function bindStoreToRender(store) {
	let prevState = store.getState()
	return (fn, listen = []) => () => {
		const current = store.getState()
		const { prev, current: newState } = mapStateToRender(
			prevState,
			current,
			listen
		)
		const changes = diff(prev, newState)
		sync.render(() => {
			if (Object.keys(changes).length) {
				fn({ prev, current: newState })
			}
			prevState = current
		})
	}
}

export const addEventPromise = (event, element, callback) => {
	let complete = false

	const done = (resolve, e) => {
		e.stopPropagation()
		element.removeEventListener(event, done)
		if (e.target === element && !complete) {
			complete = true
			resolve()
		}
	}

	return new Promise(resolve => {
		if (callback) callback()
		element.addEventListener(event, done.bind(null, resolve))
	})
}

export const preventClick = (e, node) => {
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
