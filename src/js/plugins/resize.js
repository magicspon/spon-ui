import throttle from 'raf-throttle'

const handles = {}

function addWindowResizeEvent(fn, key) {
	if (!handles[key]) {
		handles[key] = fn
	}
	if (!addWindowResizeEvent.isRunning) {
		const handle = throttle(() => {
			const entries = Object.entries(handles)
			entries.forEach(([, item]) => {
				if (typeof item === 'function') {
					item()
				}
			})

			if (entries.length === 0) {
				window.removeEventListener('resize', handle)
			}
		})

		if (Object.entries(handles).length) {
			window.addEventListener('resize', handle)
			addWindowResizeEvent.isRunning = true
		}
	}
}

function removeWindowResizeEvent(fns) {
	fns.forEach(fn => {
		delete handles[fn]
	})
}

export default function resize({ register, name }) {
	const atCache = {}
	const localList = []

	register(() => removeWindowResizeEvent(localList))

	return {
		device: {
			resize(callback) {
				const key = `${name}-r`
				callback({ width: this.width, height: this.height })
				localList.push(key)
				addWindowResizeEvent(callback, key)
			},

			at(query, { on, off }) {
				const key = `${name}-${query}`
				if (!localList.includes(key)) {
					localList.push(key)
				}

				const match = () => {
					const match = window.matchMedia(query).matches
					atCache[query] = atCache[query] || {
						match,
						called: false
					}

					if (match && !atCache[query].called && typeof on === 'function') {
						on({ width: this.width, height: this.height })
						atCache[query].called = true
					} else if (
						!match &&
						atCache[query].called &&
						typeof off === 'function'
					) {
						off({ width: this.width, height: this.height })

						atCache[query].called = false
					}
				}

				match()

				addWindowResizeEvent(match, key)

				return this
			},

			get width() {
				return window.innerWidth
			},

			get height() {
				return window.innerHeight
			}
		}
	}
}
