const store = require('../store').default

const mapState = state => ({
	cart: state.cart
})

const mapDispatch = dispatch => ({
	setCurrentView: dispatch.cart.setCurrentView
})

const connect = (state, dispatch, ...fns) => {
	return module => {
		return (...args) => {
			return module({
				...args,
				...state(store.getState()),
				...dispatch(store.dispatch),
				...fns.reduce((acc, curr) => ({ ...acc, ...curr(store) }), {})
			})
		}
	}
}

const base = props => {
	props // ?

	return () => {
		console.console.log('done')
	}
}

const node = connect(
	mapState,
	mapDispatch
)(base) // ?

const a = node({ test: 10 })
