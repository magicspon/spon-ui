import { connect } from '@/store'
import { domEvents, withPlugins } from '@spon/plugins'

function counter({ plugins: { addEvents }, store, render }) {
	const node = document.getElementById('value')

	addEvents({
		'click button': () => {
			store.increment(1)
		}
	})

	render(
		({ current }) => {
			node.textContent = current.count
		},
		['count']
	)
}

const mapState = store => {
	return {
		count: store.count
	}
}
const mapDispatch = ({ count }) => ({ ...count })

export default withPlugins(domEvents)(
	connect({ mapState, mapDispatch })(counter)
)
