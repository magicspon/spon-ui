// import { diffNodes, injectNodes } from '@/core/utils'

export const sandbox = () => {
	return {
		name: 'sandbox',

		async onExit({ update, prevHtml }) {
			const { node, style, addEvent } = prevHtml

			await update(next => {
				addEvent('transitionend', () => {
					style.set({ opacity: 0 })
				}).then(() => {
					node.parentNode.removeChild(node)
					next()
				})
			})
		},

		async onEnter({ update, newHtml }) {
			const { node, style, addEvent } = newHtml

			style.set({ opacity: 0 })
			style.render()
			this.container.node.appendChild(node)

			await update(next => {
				addEvent('transitionend', () => {
					style.set({ opacity: 1 })
				}).then(() => {
					next()
				})
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
