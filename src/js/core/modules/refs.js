// @ts-check
import styler from 'stylefire'

/**
 * @function addEventPromise
 * @param {string} event
 * @param {HTMLElement} element
 * @param {function} callback
 * @return {Promise}
 */
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

/**
 * @typedef {Object} DataRefs
 * @property {function} add add delegated events
 * @property {function} has remove event by key
 * @property {function} delete remove event by key
 */

/**
 * @function createDataRefs
 * @param {HTMLElement} node
 * @return {DataRefs}
 */
function createDataRefs(node) {
	const item = {
		add(key, value) {
			node.dataset[key] = value
		},

		has(key) {
			return !!node.dataset[key]
		},

		delete(key) {
			node.removeAttribute(key)
			delete node.dataset[key]
		}
	}

	const data = Object.entries(node.dataset)

	return data.reduce((acc, [key]) => {
		Object.defineProperties(acc, {
			[key]: {
				/**
				 * @method set
				 * @param {string} value
				 * @return {void}
				 */
				set(value) {
					node.dataset[key] = value
				},
				/**
				 * @method get
				 * @return {string}
				 */
				get() {
					return node.dataset[key]
				}
			}
		})

		return acc
	}, item)
}

/**
 * @typedef {Object} Node
 * @property {HTMLElement} node
 * @property {string} id
 * @property {object} data
 * @property {object} style
 * @property {function} className
 * @property {function} addClass
 * @property {function} removeClass
 * @property {function} addEvent
 */

/**
 * @function createNode
 * @param {HTMLElement} node
 * @return {Node}
 */
export function createNode(node) {
	if (!node) return
	let { className: baseClass } = node
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
			baseClass = node.className
		},
		removeClass(...className) {
			node.classList.remove(...className)
			baseClass = node.className
		},
		addEvent(event, fn) {
			return addEventPromise(event, node, fn)
		}
	}
}

/**
 * @function createNode
 * @param {HTMLElement} node the root node to query from
 * @return {Object}
 */
function getRefs(node) {
	const elements = [...node.querySelectorAll('*[data-ref]')]
	if (!elements.length) return

	const refs = elements.reduce((acc, /** @type {HTMLElement} */ node) => {
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
/**
 * @namespace withRefs
 * @property {object} props
 * @property {HTMLElement} props.node the root node to query from
 * @property {function} props.register a function used to store the destroy method
 * @return {object}
 */
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
