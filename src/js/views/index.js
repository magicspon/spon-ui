export const sandbox = () => {
	return {
		async onExit({ update, rootNode }) {
			const { node, style, addEvent } = rootNode
			log('onExit:components/preview/sandbox')

			await update(({ next }) => {
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
			log('onEnter:components/preview/sandbox')

			await update(({ next }) => {
				addEvent('transitionend', () => {
					style.set({ opacity: 1 })
				}).then(() => {
					next()
				})
			})
		}
	}
}

export const terry = () => {
	return {
		async onExit({ update, rootNode }) {
			const { node, style, addEvent } = rootNode
			log('onExit:terry')

			await update(({ next }) => {
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
			log('onEnter:terry')

			await update(({ next }) => {
				addEvent('transitionend', () => {
					style.set({ opacity: 1 })
				}).then(() => {
					next()
				})
			})
		}
	}
}
