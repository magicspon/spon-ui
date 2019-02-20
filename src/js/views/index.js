// import { diffNodes, injectNodes } from '@/core/utils'
import { createNode } from '@/core'

export const boxes = () => {
	return {
		name: 'boxes',

		oldBox: null,

		fetchOptions: {
			headers: {
				test: 10
			}
		},

		beforeExit() {
			console.log('hello')
		},

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
				box.style.set({ opacity: 1 })
				box.style.render()
			})

			await update(next => {
				setTimeout(() => {
					oldBox.node.parentNode.removeChild(oldBox.node)
					console.log('and update')
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
// 		async clearDom(html) {
// 			const { node, style, addEvent } = html
// 			return addEvent('transitionend', () => {
// 				style.set({ opacity: 0 })
// 			}).then(() => {
// 				node.parentNode.removeChild(node)
// 			})
// 		},

// 		async onExit({ update, prevHtml }) {
// 			await update(next => {
// 				this.clearDom(prevHtml).then(() => {
// 					next()
// 				})
// 			})
// 		},

// 		async onEnter({ update, newHtml }) {
// 			const { node, style, addEvent } = newHtml
// 			style.set({ opacity: 0 })
// 			this.container.node.appendChild(node)
// 			await update(next => {
// 				addEvent('transitionend', () => {
// 					style.set({ opacity: 1 })
// 				}).then(() => {
// 					next()
// 				})
// 			})
// 		}
// 	}
// }
