import { connect } from '@/store'
import { domEvents, withPlugins, device } from '@spon/plugins'

/* eslint-disable no-console */
function counter({
	node,
	name,
	plugins: { addEvents, device },
	store,
	render
}) {
	addEvents({
		'click button': () => {
			store.increment(1)
		}
	})

	// device.resize(() => {
	// 	// called when the window resizes
	// 	console.log('window resized', device.width, device.height)
	// })

	device.at('(min-width: 1024px)', {
		on: () => {
			// called when the media query matches the current viewport
			console.log('min width is 1024px')
		},

		off: () => {
			// called when the media query does not match the current viewport
			console.log('max width is 1024px')
		}
	})

	render(
		({ current }) => {
			node.textContent = current.count
		},
		['count']
	)

	return () => {
		console.log(`destroy: ${name}`)
	}
}

const mapState = store => {
	return {
		count: store.count
	}
}
const mapDispatch = ({ count }) => ({ ...count })

export default withPlugins(domEvents, device)(
	connect({ mapState, mapDispatch })(counter)
)
