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

import { cloneModule } from '@/core/loader'

function trackMove({ store, render, node }) {
	const unsubscribe = store.subscribe(
		render(
			({ current }) => {
				const { move } = current
				log('render:trackMove')
				node.textContent = JSON.stringify(move, null, 2)
			},
			['move']
		)
	)

	return () => {
		unsubscribe()
	}
}

// you can only have one data-spon="trackMove" per page...
// but you can clone behaviours and attach to other nodes
cloneModule(trackMove, {
	node: document.getElementById('clone'),
	name: 'trackMove-2'
})

export default trackMove