import delegate from 'dom-delegate'

const createStore = () => {
	const store = {}

	return {
		add(key, value) {
			store[key] = value
		},

		delete(key) {
			delete store[key]
		},

		get store() {
			return store
		}
	}
}

export default (node = document.body) => {
	const root = delegate(node)
	const eventStore = createStore()

	const addEvents = events => {
		Object.entries(events).forEach(([key, fn]) => {
			const [event, selector] = key.split(' ')
			eventStore.add(`${event} ${selector}`, fn)
			root.on(event, selector, fn)
		})
	}

	const removeEvents = () => {
		Object.entries(eventStore.store).forEach(([key, fn]) => {
			const [event, selector] = key.split(' ')
			eventStore.delete(`${event} ${selector}`)
			root.off(event, selector, fn)
		})
	}

	const removeEvent = key => {
		const [event, selector] = key.split(' ')
		const fn = eventStore.store[key]
		root.off(event, selector, fn)
	}

	return {
		addEvents,
		removeEvents,
		removeEvent
	}
}
