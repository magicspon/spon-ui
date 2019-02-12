import { render as h, html } from 'lit-html'
import { withRefs, withDomEvents } from '@/core'
import { connect } from '@/store'

function basket(props) {
	const {
		plugins: { addEvents, refs },
		store: { deleteItemFromCart },
		render
	} = props
	const { list } = refs

	addEvents({
		'click [data-basket-item]': (e, elm) => {
			e.preventDefault()
			const { id } = elm.dataset
			deleteItemFromCart(id)
		}
	})

	render(({ current }) => {
		const { cart } = current
		const { basket } = cart
		const items = Object.values(basket)
		const total = items.reduce((acc, { quantity }) => acc + quantity, 0)

		const basketList = items.map(
			item => html`
				<div
					style="transition-duration: 1000ms"
					class="flex trans"
					data-flip-key="${item.id}"
				>
					<div class="mr-2" data-basket-item data-id="${item.id}">
						${item.title} x${item.quantity}
					</div>
					<button data-basket-item data-id="${item.id}">
						Remove
					</button>
				</div>
			`
		)

		h(
			html`
				<h1>${items.length} - ${total}</h1>
				<div>${basketList}</div>
			`,
			list.node
		)
	})
}

// // get the cart state
const mapState = ({ cart }) => ({ cart })
// get all of the cart actions
const mapDispatch = ({ cart }) => ({ ...cart })
// export the component wrapped with store values
// and any custom plugins
export default connect({
	store: [mapState, mapDispatch],
	plugins: [withDomEvents, withRefs]
})(basket)
