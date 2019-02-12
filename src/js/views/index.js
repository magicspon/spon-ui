// import { diffNodes, injectNodes } from '@/core/utils'
import { createNode } from '@/core'

export const boxes = () => {
	return {
		name: 'boxs',

		oldBox: null,

		async onExit({ update, prevHtml, newHtml }) {
			const { node } = prevHtml
			const oldBox = createNode(
				node.querySelector('[data-box="a"]').cloneNode(true)
			)
			this.container.node.appendChild(newHtml.node)
			node.parentNode.removeChild(node)
			newHtml.node.appendChild(oldBox.node)

			const box = createNode(newHtml.node.querySelector('[data-box="a"]'))
			box.node.style.opacity = 0

			const {
				top: fromTop,
				left: fromLeft
			} = oldBox.node.getBoundingClientRect()
			const { top: toTop, left: toLeft } = box.node.getBoundingClientRect()

			const xDiff = toLeft - fromLeft
			const yDiff = toTop - fromTop

			await oldBox.addEvent('transitionend', () => {
				oldBox.style.set({
					x: xDiff,
					y: yDiff,
					backgroundColor: box.style.get('background-color'),
					zIndex: -1
				})
			})

			await oldBox.addEvent('transitionend', () => {
				box.node.style.opacity = 1
			})

			await update(next => {
				setTimeout(() => {
					oldBox.node.parentNode.removeChild(oldBox.node)
					next()
				}, 300)
			})
		},

		async onEnter({ update }) {
			await update(next => {
				next()
			})
		}
	}
}

// export function diffNodes(oldNode, newNode) {
// 	const getKeys = node =>
// 		[...node.querySelectorAll('[data-route-key]')].reduce((acc, curr) => {
// 			const { routeKey: key } = curr.dataset
// 			acc[key] = {
// 				node: curr,
// 				html: curr.outerHTML
// 			}
// 			return acc
// 		}, {})

// 	const oldKeys = getKeys(oldNode)
// 	const newKeys = getKeys(newNode)

// 	return {
// 		changes: diff(oldKeys, newKeys),
// 		oldKeys,
// 		newKeys
// 	}
// }

// export function injectNodes(changes, oldKeys, newKeys) {
// 	Object.keys(changes).forEach(key => {
// 		const oldNode = oldKeys[key]
// 		const newNode = newKeys[key]

// 		const parent = oldNode.node.parentNode
// 		parent.replaceChild(newNode.node, oldNode.node)
// 	})
// }

// export const terry = ({ transitions }) => {
// 	return {
// 		name: 'terry',
// 		async onExit(props) {
// 			const { update, newHtml, prevHtml } = props
// 			try {
// 				const { node } = newHtml
// 				diffNodes(prevHtml.node, node)
// 				update(next => next())
// 			} catch {
// 				transitions.default.onExit(props)
// 			}
// 		},
// 		async onEnter(props) {
// 			const { update, newHtml, prevHtml } = props
// 			try {
// 				const { node } = newHtml
// 				const { changes, oldKeys, newKeys } = diffNodes(prevHtml.node, node)
// 				await update(next => {
// 					injectNodes(changes, oldKeys, newKeys)
// 					next()
// 				})
// 			} catch {
// 				transitions.default.onEnter(props)
// 			}
// 		}
// 	}
// }
