import { init } from '@rematch/core'
// import createRematchPersist from '@rematch/persist'
import * as models from './models/index'
import route from '../core/models/route'
import loader from '../core/models/loader'

// const persistPlugin = createRematchPersist({
// 	whitelist: ['cart'],
// 	throttle: 1000
// })

const store = init({
	models: {
		...models,
		router: route(),
		loader
	}
	// plugins: [persistPlugin]
})

export default store
