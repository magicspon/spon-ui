import { createNode } from '@/core/refs'
import { html } from 'lit-html'
import { connect } from '@/core'
/**
 * @namespace
 * @property {object} spon
 * @property {HTMLElement} spon.node - the dom node with the matching data-spon
 * @property {object} spon.store - the redux store object
 * @property {function} spon.render - the render method to be used by the store subscription
 * @property {function} spon.h - hyperhtml wrapper function
 * @property {object} spon.domEvents - module to handle event delegation with three methods, addEvents, removeEvent, removeEvents
 * @property {object} spon.getRefs - module used to create dom references, returns an object of dom elements with special powers
 *
 * @return {fn} - a function to remove any custom event handlers. this function is called when the behaviour is destroyed
 */

function Cart({
	render,
	h,
	cart,
	domEvents,
	refs,
	node,
	fetchItems,
	setCurrentView,
	addToCart,
	...rest
}) {
	log(rest)
	const { addEvents } = domEvents(node)
	// const { dispatch } = store
	const { product } = refs
	const buttons = [...node.querySelectorAll('[data-button]')].map(createNode)

	addEvents({
		'click [data-button]': (e, elm) => {
			e.preventDefault()
			const { id } = elm.dataset
			const { items } = cart

			if (items[id]) {
				setCurrentView(id)
			} else {
				fetchItems(id)
			}
		},
		'click [data-product]': (e, elm) => {
			e.preventDefault()
			const { id } = elm.dataset
			addToCart(id)
		}
	})

	render(({ current }) => {
		const { cart } = current
		const { items, id } = cart.currentView

		buttons.forEach(node => {
			node.className = node.id === id ? 'text-red' : ''
		})

		if (items && items.length) {
			h(
				items.map(
					item => html`
						<div class="mx-1 mb-1 border p-1 trans">
							<div class="text-ms-4 mb-1">${item.title}</div>
							<button class="border p-0-5" data-product data-id="${item.id}">
								buy thing
							</button>
						</div>
					`
				),
				product.node
			)
		}
	})

	return () => {
		// unsubscribe()
	}
}

const mapState = state => ({
	cart: state.cart
})

const mapDispatch = ({ cart }) => ({
	fetchItems: cart.fetchItems,
	setCurrentView: cart.setCurrentView,
	addToCart: cart.addToCart
})

export default connect(
	mapState,
	mapDispatch,
	props => {
		log(props)
		return {
			a: 'hello'
		}
	}
)(Cart)
