import mitt from 'mitt'
import raf from 'raf-throttle'

export default () => {
	const events = mitt()

	const getCurrentBreakpoint = () =>
		style.getPropertyValue('content').replace(/'|"/g, '')

	let width = window.innerWidth
	let height = window.innerHeight
	let handle
	let style = window.getComputedStyle(document.body, ':after')
	let last
	let query = getCurrentBreakpoint()

	const update = () => {
		width = window.innerWidth
		height = window.innerHeight
	}

	const once = (arg, fn) => {
		if (once.value === arg) return
		fn(arg)
		once.value = arg
	}

	const match = (breakpoint, resolve, reject) => {
		const match = window.matchMedia(breakpoint).matches
		match ? once(match, resolve) : once(match, reject)
	}

	const dispatch = () =>
		requestAnimationFrame(() => {
			update()
			query = getCurrentBreakpoint()

			if (last !== query) {
				events.emit('view:change', { width, height, query })
				last = query
			}

			events.emit('view:resize', { width, height })
		})

	const at = (breakpoint, resolve, reject) => {
		match(breakpoint, resolve, reject)

		events.on('view:resize', () => {
			match(breakpoint, resolve, reject)
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
