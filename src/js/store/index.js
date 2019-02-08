import { init } from '@rematch/core'
// import createRematchPersist from '@rematch/persist'
import * as models from './models/index'

// const persistPlugin = createRematchPersist({
// 	whitelist: ['cart'],
// 	throttle: 1000
// })

const store = init({
	models: {
		...models
	}
	// plugins: [persistPlugin]
})

export default store
