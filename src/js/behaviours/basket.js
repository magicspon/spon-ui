/* eslint-disable no-unused-expressions */

import h from '@/core/dom'

/**
 * @namespace
 * @property {object} spon
 * @property {HTMLElement} spon.node - the dom node with the matching data-spon
 * @property {object} spon.store - the redux store object
 * @property {function} spon.render - the render method to be used by the store subscription
 * @property {object} spon.domEvents - module to handle event delegation with three methods, addEvents, removeEvent, removeEvents
 * @property {object} spon.getRefs - module used to create dom references, returns an object of dom elements with special powers
 *
 * @return {fn} - a function to remove any custom event handlers. this function is called when the behaviour is destroyed
 */

function basket({ store, render, domEvents, node, refs }) {
	const { addEvents } = domEvents(node)
	const { dispatch } = store
	const { list } = refs

	addEvents({
		'click [data-basket-item]': (e, elm) => {
			e.preventDefault()
			const { id } = elm.dataset
			dispatch.cart.deleteItemFromCart(id)
		}
	})

	const unsubscribe = store.subscribe(
		render(
			({ current }) => {
				const { cart } = current
				const { basket } = cart
				h(
					list.node,
					Object.values(basket),
					item => `
                <div class="flex justify-between>
                  <div data-basket-item data-id="${item.id}">
                    ${item.title} x${item.quantity}
                  </div>
                  <button data-basket-item data-id="${item.id}">Remove</button>
                </div>`
				)
			},
			['cart']
		)
	)

	return () => {
		unsubscribe()
	}
}

export default basket
