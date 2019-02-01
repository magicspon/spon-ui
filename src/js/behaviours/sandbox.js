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
import sync from 'framesync'

function mango({ node, store, render, domEvents, refs }) {
	// store, render, domEvents, getRefs
	const { dispatch } = store
	const { button, data } = refs
	const { addEvents, removeEvents } = domEvents(node)

	// wrap batch calls in a sync update to ensue call order
	sync.update(() => {
		dispatch.count.addGroup(button.data.get('key'))
	})

	addEvents({
		[`click ${button.selector}`]: () => {
			dispatch.count.addItemGroup({ key: '10', value: 'hello' })
			button.data.set('thing', 500)
		}
	})

	button.on('data:update', ({ prev, current }) => {
		log('hello', prev, current)
	})

	const unsubscribe = store.subscribe(
		render(
			({ current }) => {
				data.node.textContent = current.count.items['10'].count
			},
			['count']
		)
	)

	return () => {
		removeEvents()
		unsubscribe()
	}
}

export default mango
