/**
 * @namespace
 * @property {object} spon
 * @property {HTMLElement} spon.node - the dom node with the matching data-spon
 * @property {object} spon.store - the redux store object
 * @property {function} spon.render - the render method to be used by the store subscription
 * @property {object} spon.domEvents - module to handle event delegation with three methods, addEvents, removeEvent, removeEvents
 * @property {object} spon.getRefs - module used to create dom references, returns an object of dom elements with special powers
 *
 * @return {fn} - a function to remove any event handlers. this function is called when the behaviour is destroyed
 */

function mango({ store, render, domEvents, refs }) {
	const { dispatch } = store
	const { button, box } = refs
	const { addEvents, removeEvents } = domEvents()

	const actions = key =>
		({
			'37': { x: -50 },
			'38': { y: -50 },
			'39': { x: 50 },
			'40': { y: 50 }
		}[key] || false)

	addEvents({
		keydown: e => {
			const state = actions(e.keyCode)
			log('keydown')
			if (state) {
				dispatch.move.move(state)
			}
		},
		[`click ${box.selector}`]: () => {
			log('click')
		}
	})

	const unsubscribe = store.subscribe(
		render(
			({ current }) => {
				const { move } = current
				log('render:sandbox')

				button.style.set({ ...move })
			},
			['move']
		)
	)

	return () => {
		removeEvents()
		unsubscribe()
	}
}

export default mango
