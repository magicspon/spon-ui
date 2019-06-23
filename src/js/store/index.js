import { init } from '@rematch/core'
import createRematchPersist from '@rematch/persist'
import connectStore from '@spon/connect'

const persistPlugin = createRematchPersist({
	whitelist: ['cart'],
	throttle: 1000,
	version: 1
})

const store = init({
	models: {
		count: {
			state: 0, // initial state
			reducers: {
				// handle state changes with pure functions
				increment(state, payload) {
					return state + payload
				}
			}
		}
	},
	plugins: [persistPlugin]
})

// this creates a function that is used to bind modules to the store
export const connect = connectStore(store)

export default store
