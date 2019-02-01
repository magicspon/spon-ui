export const count = {
	state: {
		items: []
	},
	reducers: {
		addGroup: (state, payload) => {
			const { items } = state

			if (items[payload]) return state

			return {
				...state,
				items: {
					...items,
					[payload]: {}
				}
			}
		},
		addItemGroup: (state, payload) => {
			const { items } = state
			const { key, value } = payload
			const item = items[key]
			const { count = 0 } = item

			return {
				...state,
				items: {
					...items,
					[key]: {
						...item,
						count: count + 1,
						value
					}
				}
			}
		}
	}
	// effects: dispatch => ({
	// 	async incrementAsync() {
	// 		await setTimeout(() => {
	// 			dispatch.count.increment()
	// 		}, 1000)
	// 	}
	// })
}
