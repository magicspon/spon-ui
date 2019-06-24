import { connect } from '@/store'
import { domEvents, withPlugins } from '@spon/plugins'

/* eslint-disable no-console */
function counter({ plugins: { addEvents }, store, render }) {
	const node = document.getElementById('value')

	console.log(store.count)

	addEvents({
		'click button': () => {
			console.log('click')
			store.increment(1)
		}
	})

	render(
		({ current }) => {
			node.textContent = current.count
		},
		['count']
	)

	return () => {
		console.log('destroy')
	}
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

/**
 *
 * refs html
 *
 * single items
 * data-ref="thing"
 *
 * arrays
 * data-ref="other[]"
 *
 * function({refs}) {
 *
 *  const { thing, other } = refs
 *
 *  thing === ref items
 * 	other === Array of ref items
 *
 * }
 *
 * thing.data === any data props. these are getters and setters so a little reactive
 * i.e.
 *
 * <div data-ted="9">
 * thing.data.ted = 10
 * would update to <div data-ted="10">
 *
 * thing.data.on('change', () => {
 *  // do shit
 * })
 *
 * thing.classes = 'the default classes'
 * thing.setClass = classNames(thing.classes, { isOpen: thing.data.ted === 10 })
 *
 * thing.addEventPromise('transitionEnd' () => {})
 *
 * thing.style.set({
 * 	display: 'flex'
 * })
 *
 *
 */
