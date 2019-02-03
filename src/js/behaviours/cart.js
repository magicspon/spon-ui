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

function clock({ store, render, domEvents, node, refs }) {
	const { addEvents } = domEvents()
	const { dispatch } = store
	const { product } = refs

	addEvents({
		'click [data-button]': (e, elm) => {
			e.preventDefault()
			const { id } = elm.dataset
			const {
				cart: { items }
			} = store.getState()

			if (items[id]) {
				dispatch.cart.setCurrentView(id)
			} else {
				dispatch.cart.fetchItems({
					id,
					callback: ({ id }) => {
						dispatch.cart.setCurrentView(id)
					}
				})
			}
		},

		'click [data-product]': (e, elm) => {
			e.preventDefault()
			const { id } = elm.dataset
			dispatch.cart.addToCart(id)
		}
	})

	const unsubscribe = store.subscribe(
		render(
			({ current }) => {
				const { cart } = current
				const { items } = cart.currentView

				if (items) {
					h(
						product.node,
						items,
						item => `
								<div class="flex justify-between">
									${item.title}
									<button class="ml-2" data-product data-id="${item.id}">
										add to cart
									</button>
								</div>`
					)
				}
			},
			['cart']
		)
	)

	return () => {
		unsubscribe()
	}
}

export default clock
