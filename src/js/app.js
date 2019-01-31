import '@/plugins/logger'
import getRefs from '@/core/refs'
import domEvents from '@/core/domEvents'
import store, { render } from '@/store'

const node = document.getElementById('sandbox')
const sandbox = ({ node, store, render }) => {
	const { refs } = getRefs(node)
	const { dispatch } = store
	const { button } = refs
	const { addEvents, removeEvents } = domEvents(node)

	addEvents({
		[`click ${button.selector}`]: () => {
			dispatch.count.increment()
		}
	})

	const unsubscribe = store.subscribe(
		render(
			({ prev, current }) => {
				log(prev, current)
			},
			[] // an array of models you want to listen to (see store/index.js)
		)
	)

	return () => {
		removeEvents()
		unsubscribe()
	}
}

sandbox({ node, store, render })
