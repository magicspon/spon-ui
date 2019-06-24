import { connect } from '@/store'
import barba from '@barba/core'

/* eslint-disable no-console */
function logger({ node, store, render }) {
	// console.log(store.count)
	node.textContent = store.count

	barba.hooks.after(() => {
		console.log('after logger')
	})

	render(
		({ current }) => {
			node.textContent = current.count
		},
		['count']
	)

	return () => {
		console.log('this will never be called')
	}
}

const mapState = store => {
	return {
		count: store.count
	}
}
const mapDispatch = ({ count }) => ({ ...count })

export default connect({ mapState, mapDispatch })(logger)
