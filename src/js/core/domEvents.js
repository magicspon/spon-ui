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

function domEvents(node = document.body) {
	const root = delegate(node)
	const eventStore = createStore()

	const addEvents = (...args) => {
		const withRoot = args.length > 1
		const events = withRoot ? args[1] : args[0]
		const rootNode = withRoot ? delegate(args[0]) : root

		Object.entries(events).forEach(([key, fn]) => {
			const [event, selector] = key.split(' ')
			eventStore.add(`${event} ${selector}`, { fn, rootNode })
			rootNode.on(event, selector, fn)
		})
	}

	const removeEvent = key => {
		const [event, selector] = key.split(' ')
		const { fn, rootNode } = eventStore.store[key]

		rootNode.off(event, selector, fn)
	}

	const removeEvents = () => {
		root.destroy()
	}

	return {
		addEvents,
		removeEvents,
		removeEvent
	}
}

export function withDomEvents({ node, register }) {
	const events = domEvents(node)
	register(events.removeEvents)
	return events
}

export default domEvents
