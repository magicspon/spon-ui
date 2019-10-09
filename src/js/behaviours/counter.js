import { domEvents, withPlugins, device } from '@spon/plugins'
import { connect } from '@/store'

/* eslint-disable no-console */
function counter({ node, plugins: { addEvents, device }, store, subscribe }) {
	const $value = node.querySelector('[data-value]')
	const { dispatch } = store

	device.resize(() => {
		console.log('hello')
	})

	addEvents({
		'click [data-up]': () => {
			dispatch.count.increment(1)
		},

		'click [data-down]': () => {
			dispatch.count.decrement(1)
		}
	})

	setTimeout(() => {
		console.log(store.state)
	}, 3000)

	subscribe(
		state => {
			$value.textContent = state.current.count
		},
		['count']
	)
}

const mapState = ({ count, trout }) => ({ count, trout })

const mapDispatch = ({ count, trout }) => ({ count, trout })

export default withPlugins(domEvents, device)(
	connect({ mapState, mapDispatch })(counter)
)
