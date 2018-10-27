import loader from '@/core/modules/loader'
import Ui from '@/core/UiLoader'
import eventBus from '@/core/modules/eventBus'
import Router from '@/core/router/'
import * as Actions from '@/core/router/actions'

export default (() =>
	class App {
		constructor({ router, chunks }) {
			if (router && typeof window.fetch === 'function') {
				this.$router = new Router({ ...router })
			}

			this.$loader = loader(chunks)
		}

		mount = () => {
			this.$loader.hydrate(document)
			Ui.hydrate()

			if (!this.$router) return

			this.$router.mount().lazyload()

			eventBus.on(Actions.ROUTE_TRANSITION_BEFORE_DOM_UPDATE, () => {
				Ui.destroy()
				this.$loader.unmount()
			})

			eventBus.on(Actions.ROUTE_TRANSITION_AFTER_DOM_UPDATE, ({ newHtml }) => {
				this.$loader.hydrate(newHtml)

				Ui.hydrate(newHtml)

				if (window.requestIdleCallback) {
					window.requestIdleCallback(() => {
						this.$router.lazyload()
					})
				}
			})
		}
	})()
