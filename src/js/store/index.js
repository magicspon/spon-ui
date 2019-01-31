import { init } from '@rematch/core'
import sync from 'framesync'
import { diff } from 'deep-object-diff'
import { count } from './models'

const store = init({
	models: {
		count
	}
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
	return sync.render(() => {
		const current = store.getState()
		const { prev, current: newState } = mapStateToRender(
			prevState,
			current,
			listen
		)
		const changes = diff(prev, newState)
		if (Object.keys(changes).length) {
			fn({ prev, current: newState })
		}
		prevState = current
	})
}

export default store
