/* eslint-disable no-param-reassign */
import styler from 'stylefire'

function addEventPromise(event, element, callback) {
	let complete = false

	const done = (resolve, e) => {
		e.stopPropagation()
		element.removeEventListener(event, done)
		if (e.target === element && !complete) {
			complete = true
			resolve()
		}
	}

	return new Promise(resolve => {
		if (callback) callback()
		element.addEventListener(event, done.bind(null, resolve))
	})
}

const createDataRefs = node => {
	const item = {
		add(key, value) {
			node.dataset[key] = value
		},

		has(key) {
			return !!node.dataset[key]
		},

		delete(key) {
			node.removeAttribbute(key)
		}
	}

	return Object.entries(node.dataset).reduce((acc, [key]) => {
		Object.defineProperties(acc, {
			[key]: {
				set(value) {
					node.dataset[key] = value
				},
				get() {
					return node.dataset[key]
				},
				add(key, value) {
					node.dataset[key] = value
				}
			}
		})

		return acc
	}, item)
}

export const createNode = node => {
	const { className: baseClass } = node
	const { id } = node.dataset

	return {
		node,
		id,
		data: createDataRefs(node),
		style: styler(node),
		set className(className) {
			node.className = `${baseClass} ${className}`
		},
		addClass(...className) {
			node.classList.add(...className)
		},
		removeClass(...className) {
			node.classList.remove(...className)
		},
		addEvent(event, fn) {
			return addEventPromise(event, node, fn)
		}
	}
}

function getRefs(node) {
	const elements = [...node.querySelectorAll('*[data-ref]')]
	if (!elements.length) return

	const refs = elements.reduce((acc, node) => {
		const { ref } = node.dataset
		if (acc[ref]) {
			throw new Error(
				`multiple nodes with data-${ref} attribute have been found, all data-refs must be unique`
			)
		}
		acc[ref] = {
			...createNode(node),
			name: ref,
			selector: `[data-ref="${ref}"]`
		}
		return acc
	}, {})

	return refs
}

// this isn't really a higer order function
// we're just returning an object
// but it's used to that effect by @spon/core
// i.e. anything properties returned from this
// function will be added to the props provided
// to the behaviour
export function withRefs({ register, node }) {
	const refs = getRefs(node)
	register(() => {
		Object.keys(node).forEach(key => {
			delete node[key]
		})
	})
	return { refs }
}

export default getRefs
