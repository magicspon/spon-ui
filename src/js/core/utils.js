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
