export const move = {
	state: {
		x: 0,
		y: 0
	},
	reducers: {
		move: (state, payload) => {
			const { x, y } = state
			const { x: nx = 0, y: ny = 0 } = payload
			return {
				...state,
				x: x + nx,
				y: y + ny
			}
		}
	},
	effects: {}
}

export const cart = {
	state: {
		basket: [],
		items: {},
		currentView: false,
		basketCount: 0
	},
	reducers: {
		addItems(state, payload) {
			const { items } = state

			return {
				...state,
				items: {
					...items,
					[payload.id]: payload
				}
			}
		},

		addToCart(state, payload) {
			const { basket, items, currentView } = state
			const { id: parentId } = currentView
			const item = items[parentId].items.find(product => product.id === payload)

			let newBasketItem = {}

			if (basket[item.id]) {
				const product = basket[item.id]
				const { quantity = 0 } = product
				newBasketItem = {
					...product,
					quantity: quantity + 1
				}
			} else {
				newBasketItem = {
					...item,
					quantity: 1
				}
			}

			return {
				...state,
				basket: {
					...basket,
					[item.id]: newBasketItem
				}
			}
		},

		deleteItemFromCart(state, payload) {
			const { basket } = state

			const newBasket = Object.entries(basket).reduce((acc, [, value]) => {
				const { id } = value

				if (id !== payload) {
					acc[id] = value
				}

				return acc
			}, {})

			return {
				...state,
				basket: newBasket
			}
		},

		setCurrentView(state, payload) {
			const { items } = state

			return {
				...state,
				currentView: items[payload]
			}
		}
	},
	effects: dispatch => ({
		async fetchItems(id) {
			const resp = await fetch(`/api/${id}.json`).then(resp => resp.json())
			dispatch({ type: 'cart/addItems', payload: resp })
			dispatch({ type: 'cart/setCurrentView', payload: resp.id })
		}
	})
}
