// @ts-check
import { diff } from 'deep-object-diff'
import sync from 'framesync'

/**
 * @function mapStateToRenderHelper
 * @param {object} state the current state object
 * @param {array} watch array of keys to map to the given state
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
 * @param {object} prevState the previous store state
 * @param {object} current the current store state
 * @param {array} watch an array of state keys to listen to
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
 * @param {object} state the request state object
 * @param {object} store the rematch store object
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
 * @namespace connect
 * @function bindConnect
 * @description returns connect function that hooks up any plugins with a bound behaviour
 * @param {function} registerPlugins fn(str) -> fn(fn). used to track which modules are active
 * @return {function}
 */
export default function connect(registerPlugins) {
	return function(globalStore) {
		/**
		 * @function connect
		 * @memberOf connect
		 * @inner
		 * @param {object} STATE either the mapState function or an object with state/dispatch methods
		 * @param {object} DISPATCH either the mapDispatch function or an object of plugins
		 * @param {array|undefined} fns any remaining plugins
		 * @return {function}
		 */
		return function connect({ mapState, mapDispatch }) {
			const localState = mapState(globalStore.getState())
			const render = bindStoreToRender(localState, globalStore)

			const storeItem = {
				...localState,
				...mapDispatch(globalStore.dispatch)
			}
			/**
			 * @memberOf connect
			 * @inner
			 * @property {object} props the module argument object
			 * @property {object} props.key the module name
			 * @property {object} props.[...props] any other props
			 * @return {function}
			 */
			return module => {
				return ({ name, ...props }) => {
					/**
					 * @memberOf connect
					 * @inner
					 * @property {object} props the module argument object
					 * @property {object} props.[...props] any other props
					 * @property {object} props.render the store render function
					 * @property {object} props.store the store methods and state props
					 * @property {object} props.plugins any custom plugins
					 *
					 * @return {function}
					 */
					return module({
						...props,
						render: fn => {
							// add the current modules subscription function
							// to the function cache used by the core app loader
							registerPlugins(name)(globalStore.subscribe(render(fn)))
						},
						store: { ...storeItem }
					})
				}
			}
		}
	}
}
