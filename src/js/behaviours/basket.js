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

function basket() {
	// const { addEvents, removeEvents } = domEvents(node)
	// const { dispatch } = store
	// const { list } = refs

	// addEvents({
	// 	'click [data-basket-item]': (e, elm) => {
	// 		e.preventDefault()
	// 		const { id } = elm.dataset
	// 		// dispatch({ type: 'cart/deleteItemFromCart', payload: id })
	// 	}
	// })

	// const unsubscribe = store.subscribe(
	// 	render(
	// 		({ current }) => {
	// 			const { cart } = current
	// 			const { basket } = cart

	// 			h(
	// 				Object.values(basket).map(
	// 					item => html`
	// 						<div
	// 							style="transition-duration: 1000ms"
	// 							class="flex trans"
	// 							data-flip-key="${item.id}"
	// 						>
	// 							<div class="mr-2" data-basket-item data-id="${item.id}">
	// 								${item.title} x${item.quantity}
	// 							</div>
	// 							<button data-basket-item data-id="${item.id}">Remove</button>
	// 						</div>
	// 					`
	// 				),
	// 				list.node
	// 			)
	// 		},
	// 		['cart/basket']
	// 	)
	// )

	return () => {
		// unsubscribe()
		// removeEvents()
	}
}

export default basket
