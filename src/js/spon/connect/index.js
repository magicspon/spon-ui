import { diff } from 'deep-object-diff'
import sync from 'framesync'

/**
 * @function mapStateToRenderHelper
 * @param {object} state - the current state object
 * @param {array} watch - array of keys to map to the given state
 * @return {object}
 */
function mapStateToRenderHelper(state, watch) {
	return watch.length > 0
		? watch.reduce((acc, key) => {
			acc[key] = state[key]
			return acc
		  }, {})
		: state
}

/**
 * @function mapStateToRender
 * @param {object} prevState - the previous store state
 * @param {object} current - the current store state
 * @param {array} watch - an array of state keys to listen to
 * @return {object}
 */
function mapStateToRender(prevState, current, watch) {
	return {
		prev: mapStateToRenderHelper(prevState, watch),
		current: mapStateToRenderHelper(current, watch)
	}
}

/**
 * @function bindStoreToRender
 * @param {object} state - the request state object
 * @param {object} store - the rematch store object
 * @return {function}
 */
function bindStoreToRender(state, store) {
	let prevState = store.getState()
	const listen = Object.keys(state)

	// return a function, that when called
	// will return a new function that when
	// called will run any valid render methods
	return fn => () => {
		const current = store.getState()
		const { prev, current: newState } = mapStateToRender(
			prevState,
			current,
			listen
		)
		const changes = diff(prev, newState)
		sync.render(() => {
			if (Object.keys(changes).length) {
				fn({ prev, current: newState })
			}
			prevState = current
		})
	}
}

/**
 * @function connect
 * @param {object} store - the rematch store object
 * @param {function} registerPlugins - fn(str) -> fn(fn). - used to track which modules are active
 * @param {function}
 */
export default function connect(store, registerPlugins) {
	return function connect(STATE, DISPATCH, ...fns) {
		const asObject = typeof STATE !== 'function'
		const [state, dispatch] = asObject ? STATE.store : [STATE, DISPATCH]
		const localState = state(store.getState())
		const plugins = (asObject ? STATE.plugins : fns) || []
		const render = bindStoreToRender(localState, store)

		return module => {
			return ({ key, ...props }) => {
				return module({
					...props,
					render: fn => {
						// add the current modules subscription function
						// to the function cache used by the core app loader
						registerPlugins(key)(store.subscribe(render(fn)))
					},
					store: {
						...localState,
						...dispatch(store.dispatch)
					},
					plugins: {
						...plugins.reduce((acc, curr) => {
							return {
								...acc,
								...curr({
									register: registerPlugins(key),
									store,
									...props
								})
							}
						}, {})
					}
				})
			}
		}
	}
}
