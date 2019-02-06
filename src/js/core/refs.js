/* eslint-disable no-param-reassign */
import styler from 'stylefire'
import sync from 'framesync'
import mitt from 'mitt'
import { addEventPromise } from './utils'
const camelCased = str => str.replace(/-([a-z])/g, g => g[1].toUpperCase())

const createDataRefs = node => {
	const item = {
		add(key, value) {
			sync.render(() => {
				node.dataset[key] = value
			})
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
					sync.render(() => {
						node.dataset[key] = value
					})
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

	const emitter = mitt()

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
			selector: `[data-ref="${ref}"]`,
			emit: (event, ...args) => {
				emitter.emit(`${ref}:${event}`, ...args)
			},
			on(event, fn) {
				emitter.on(`${ref}:${event}`, fn)
			}
		}
		return acc
	}, {})

	// Create an observer instance linked to the callback function
	const observer = new MutationObserver(mutationsList => {
		Object.entries(mutationsList)
			.filter(([, mutation]) => {
				const {
					target: {
						dataset: { ref }
					}
				} = mutation

				return refs[ref]
			})
			.map(([, mutation]) => {
				const { target, type, attributeName, oldValue } = mutation

				const {
					dataset: { ref }
				} = target

				if (type === 'attributes') {
					if (attributeName.indexOf('data-') !== -1) {
						const name = attributeName.split('data-')[1]
						const state = target.dataset[camelCased(name)]
						if (oldValue !== state) {
							const { name } = refs[ref]

							emitter.emit(`${name}:data:update`, {
								prev: oldValue,
								current: state
							})
						}
					}
				}

				return {
					mutation,
					ref: refs[ref]
				}
			})
	})

	// Start observing the target node for configured mutations
	observer.observe(node, {
		attributes: true,
		childList: true,
		subtree: true,
		attributeOldValue: true
	})
	return { refs, observer }
}

export function withRefs({ register, node }) {
	const { refs, observer } = getRefs(node)
	register(() => {
		observer.disconnect()
	})
	return { refs }
}

export default getRefs
