import { init } from '@rematch/core'
import connectStore from '@spon/connect'

const store = init({
	models: {
		count: {
			state: 0, // initial state
			reducers: {
				increment(state, payload) {
					return state + payload
				}
			}
		}
	}
})

// this creates a function that is used to bind modules to the store
export const connect = connectStore(store)

export default store
