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

export const move = {
	state: {
		x: 0,
		y: 0
	},
	reducers: {
		move: (state, payload) => {
			const { x, y } = state
			const { x: nx = 0, y: ny = 0 } = payload
			return {
				...state,
				x: x + nx,
				y: y + ny
			}
		}
	},
	effects: {}
}

export const loader = {
	state: {
		loaded: 0,
		gary: 0
	},
	reducers: {
		setLoad: state => {
			const { loaded } = state
			return {
				...state,
				loaded: loaded + 1
			}
		},
		setGary: (state, gary) => {
			return {
				...state,
				gary
			}
		}
	},

	effects: dispatch => ({
		async setLoadAsync(payload) {
			await setTimeout(() => {
				dispatch.loader.setGary(payload)
			}, 1000)
		}
	})
}
