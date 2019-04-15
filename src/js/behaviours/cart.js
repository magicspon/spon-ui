import { render as h, html } from 'lit-html'
import { withRefs, withDomEvents, createNode, withPlugins } from '@spon/core'
import { connect } from '@/store'

function Cart(props) {
	const {
		plugins: { addEvents, refs },
		store: { cart, addToCart, fetchItems, setCurrentView },
		node,
		render
	} = props

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
		const { items = [], id } = cart.currentView
		const { basket } = cart
		buttons.forEach(node => {
			node.className = node.id === id ? 'text-red' : ''
		})

		h(
			items.map(
				item => html`
					<div class="mx-1 mb-1 border p-1 trans">
						<div class="text-ms-4 flex mb-1">
							${item.title}
							<span style="font-size: 10px">
								${basket[item.id] &&
									html`
										<div>${basket[item.id].quantity}</div>
									`}
							</span>
						</div>

						<button class="border p-0-5" data-product data-id="${item.id}">
							buy thing
						</button>
					</div>
				`
			),
			product.node
		)
	})

	return () => {
		setCurrentView(null)
	}
}

// get the cart state
const mapState = ({ cart }) => ({ cart })
// get all of the cart actions
const mapDispatch = ({ cart }) => ({ ...cart })
// export the component wrapped with store values
// and any custom plugins

export default connect({
	mapState,
	mapDispatch
})(withPlugins(withDomEvents, withRefs)(Cart))
