import { init } from '@rematch/core'
import createRematchPersist from '@rematch/persist'
import sync from 'framesync'
import { diff } from 'deep-object-diff'
import { count, move, loader } from './models'

const persistPlugin = createRematchPersist({
	whitelist: ['move'],
	throttle: 1000
})

const store = init({
	models: {
		count,
		move,
		loader
	},
	plugins: [persistPlugin]
})

let prevState = store.getState()

const mapStateToRenderHelper = (state, watch) =>
	watch.length > 0
		? watch.reduce((acc, key) => {
			acc[key] = state[key]
			return acc
		  }, {})
		: state

const mapStateToRender = (prevState, current, watch) => ({
	prev: mapStateToRenderHelper(prevState, watch),
	current: mapStateToRenderHelper(current, watch)
})

export const render = (fn, listen = []) => () => {
	const current = store.getState()
	const { prev, current: newState } = mapStateToRender(
		prevState,
		current,
		listen
	)
	// i need to know if the changes have been applied to the current call
	// this code won't work as is....
	const changes = diff(prev, newState)
	sync.render(() => {
		if (Object.keys(changes).length) {
			fn({ prev, current: newState })
		}
		prevState = current
	})
}

export default store
