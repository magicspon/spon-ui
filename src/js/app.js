import '@/plugins/logger'
import getRefs from '@/core/refs'
import domEvents from '@/core/domEvents'
import store, { render } from '@/store'

const node = document.getElementById('sandbox')
const sandbox = ({ node, store, render }) => {
	const { refs } = getRefs(node)
	const { dispatch } = store
	const { button, data } = refs
	const { addEvents, removeEvents } = domEvents(node)

	dispatch.count.addGroup(button.data.get('key'))

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
			['count'] // an array of models you want to listen to (see store/index.js)
		)
	)

	return () => {
		removeEvents()
		unsubscribe()
	}
}

sandbox({ node, store, render })
