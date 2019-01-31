/* eslint-disable no-param-reassign */
import styler from 'stylefire'
import sync from 'framesync'
import mitt from 'mitt'

const camelCased = str => str.replace(/-([a-z])/g, g => g[1].toUpperCase())

const getRefs = node => {
	const elements = [...node.querySelectorAll('[data-ref]')]
	const emitter = mitt()

	const refs = elements.reduce((acc, node) => {
		const { ref } = node.dataset

		if (acc[ref]) {
			throw new Error(
				`multiple nodes with data-${ref} attribute have been found, all data-refs must be unique`
			)
		}

		acc[ref] = {
			node,
			selector: `[data-ref="${ref}"]`,
			data: {
				set: (key, value) => {
					sync.update(() => {
						node.dataset[key] = value
					})
				},

				get: key => {
					return node.dataset[key]
				}
			},
			styler: styler(node)
		}

		return acc
	}, {})

	const config = {
		attributes: true,
		childList: true,
		subtree: true,
		attributeOldValue: true
	}

	const callback = mutationsList => {
		const mutations = Object.entries(mutationsList)
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
						emitter.emit('data:update', {
							name,
							prev: oldValue,
							current: state
						})
					}
				}

				return {
					mutation,
					ref: refs[ref]
				}
			})

		emitter.emit('dom:update', mutations)
	}

	// Create an observer instance linked to the callback function
	const observer = new MutationObserver(callback)

	// Start observing the target node for configured mutations
	observer.observe(node, config)

	return { refs, emitter, observer }
}

export default getRefs
