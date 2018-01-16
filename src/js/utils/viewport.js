import mitt from 'mitt'
import raf from 'raf-throttle'

export default () => {
	const events = mitt()
	let width = window.innerWidth
	let height = window.innerHeight
	let handle

	const update = () => {
		width = window.innerWidth
		height = window.innerHeight
	}

	const once = (arg, fn) => {
		if (once.value === arg) return
		fn(arg)
		once.value = arg
	}

	const dispatch = () =>
		requestAnimationFrame(() => {
			update()
			events.emit('resize', { width, height })
		})

	const at = (breakpoint, resolve, reject) => {
		events.on('resize', () => {
			const match = window.matchMedia(breakpoint).matches
			match ? once(match, resolve) : once(match, reject)
		})
	}

	const start = () => {
		handle = raf(dispatch)
		window.addEventListener('resize', handle, false)
	}

	const destroy = () => {
		window.removeEventListener('resize', handle, false)
		handle.cancel()
	}

	return {
		...events,
		width,
		height,
		at,
		start,
		destroy
	}
}
