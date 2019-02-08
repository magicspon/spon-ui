import { init } from '@rematch/core'
import { connect as bindConnect, registerPlugin } from '@/core'
import * as models from './models/index'

const store = init({
	models: {
		...models
	}
})

export const connect = bindConnect(store, registerPlugin)

export default store
