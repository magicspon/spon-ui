import '@/plugins/logger'
import getRefs from '@/core/refs'
import domEvents from '@/core/domEvents'
import store, { render } from '@/store'

const node = document.getElementById('sandbox')
const sandbox = ({ node, store, render }) => {
	const { refs, emitter } = getRefs(node)
	const { dispatch } = store
	const { button } = refs
	const { addEvents, removeEvents } = domEvents(node)

	addEvents({
		[`click ${button.selector}`]: () => {
			dispatch.count.addGroup(button.data.get('key'))
			dispatch.count.addItemGroup({ key: '10', value: 'hello' })
		},
		keydown: () => {
			button.data.set('thing', 500)
		}
	})

	emitter.on('data:update', ({ ref, name, prev, current }) => {
		log('hello', ref, name, prev, current)
	})

	const unsubscribe = store.subscribe(
		render(
			({ prev, current }) => {
				log(current.count.items['10'].count)
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
