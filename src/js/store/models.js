export const count = {
	state: 0,
	reducers: {
		increment: state => state + 1,
		decrement: state => state - 1
	},
	effects: dispatch => ({
		async incrementAsync() {
			await setTimeout(() => {
				dispatch.count.increment()
			}, 1000)
		}
	})
}

export const terry = {
	state: 0,
	reducers: {
		increment: state => state + 1,
		decrement: state => state - 1
	},
	effects: dispatch => ({
		async incrementAsync() {
			await setTimeout(() => {
				dispatch.count.increment()
			}, 1000)
		}
	})
}
