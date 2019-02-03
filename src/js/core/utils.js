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

export const mapStateToRenderHelper = (state, watch) =>
	watch.length > 0
		? watch.reduce((acc, key) => {
			acc[key] = state[key]
			return acc
		  }, {})
		: state

export const mapStateToRender = (prevState, current, watch) => ({
	prev: mapStateToRenderHelper(prevState, watch),
	current: mapStateToRenderHelper(current, watch)
})
