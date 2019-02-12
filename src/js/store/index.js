import { init } from '@rematch/core'
import createRematchPersist from '@rematch/persist'
import { connect as bindConnect, registerPlugin } from '@/core'
import * as models from './models/index'

const persistPlugin = createRematchPersist({
	whitelist: ['cart'],
	throttle: 1000,
	version: 1
})

const store = init({
	models: {
		...models
	},
	plugins: [persistPlugin]
})

export const connect = bindConnect(store, registerPlugin)

export default store
