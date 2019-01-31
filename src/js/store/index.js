import { init } from '@rematch/core'
import sync from 'framesync'
import { count, terry } from './models'

const store = init({
	models: {
		count,
		terry
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

export const render = (fn, listen) => () => {
	return sync.render(() => {
		const current = store.getState()
		fn(mapStateToRender(prevState, current, listen))
		prevState = current
	})
}

export default store
