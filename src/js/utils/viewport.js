import mitt from 'mitt'
import raf from 'raf-throttle'

export default () => {
	let width = window.innerWidth
	let height = window.innerHeight

	const update = () => {
		width = window.innerWidth
		height = window.innerHeight
	}

	const events = mitt()

	const dispatch = () =>
		requestAnimationFrame(() => {
			update()
			events.emit('resize', { width, height })
		})

	return {
		...events,
		width,
		height,

		start() {
			window.addEventListener('resize', raf(dispatch), false)

			return this
		}
	}
}
