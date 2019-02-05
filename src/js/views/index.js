import { diffNodes, injectNodes } from '@/core/utils'

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

export const terry = ({ transitions }) => {
	return {
		name: 'terry',
		async onExit(props) {
			const { update, newHtml, prevHtml } = props
			try {
				const { node } = newHtml
				diffNodes(prevHtml.node, node)
				update(next => next())
			} catch {
				transitions.default.onExit(props)
			}
		},
		async onEnter(props) {
			const { update, newHtml, prevHtml } = props
			try {
				const { node } = newHtml
				const { changes, oldKeys, newKeys } = diffNodes(prevHtml.node, node)
				await update(next => {
					injectNodes(changes, oldKeys, newKeys)
					next()
				})
			} catch {
				log(transitions)
				transitions.default.onEnter(props)
			}
		}
	}
}
