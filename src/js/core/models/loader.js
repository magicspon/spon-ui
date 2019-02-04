export default {
	state: {
		store: {}
	},
	reducers: {
		addModule: (state, key) => {
			const { store } = state
			return {
				...state,
				store: {
					...store,
					[key]: key
				}
			}
		},
		removeModule: (state, key) => {
			delete state.store[key]
			return state
		}
	}
}
