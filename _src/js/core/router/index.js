import NProgress from 'nprogress'
import { createEvents } from '@/core/modules/createEvents'
import eventBus from '@/core/modules/eventBus'
import { composeProps } from '@/core/modules/refs'
import { preventClick, activeLinks, localLinks } from './utils/links'
import historyManager from './history'
import cache from './cache'
import request, { Queue } from './request'
import lazyload from './lazyload'
import Lifecycle from './lifecycle'
import * as Action from './actions'

/**
 * @namespace RouterUtils
 */

export default (() => {
	const defaultRoutes = [
		{
			path: '/',
			view: {}
		},
		{
			path: '*',
			view: {}
		}
	]

	/**
	 * Create a router
	 * @namespace Router
	 *
	 * @class Router
	 *
	 * @param {Object} options
	 * @param {String} options.routes - an array of routes
	 * @param {HTMLElement} options.rootNode - the root html element
	 * @param {Array} options.navLinks - any array of anchors to update on transition
	 * @param {Object} options.classes.match - The class applied to matching linkes
	 * @param {Object} options.classes.root - The class applied to matching root link
	 * @param {Object} options.classes.parent - The class applied to mathcing parent link
	 *
	 */
	return class Router {
		constructor({
			routes = defaultRoutes,
			rootNode,
			navLinks,
			classes,
			onEnter,
			onExit,
			prefetchTargets = '[data-prefetch]',
			progressOptions = {
				showSpinner: true
			}
		}) {
			this.lifecycle = new Lifecycle({ routes, rootNode })

			this.lifecycle.onLoad()

			this.prefetchTargets = prefetchTargets

			// the root node...
			this.$wrapper = rootNode
			this.$links = activeLinks({ scope: navLinks, classes })

			// set the dom events
			this.$events = createEvents.call(this, document, {
				'click a': 'onClick',
				'mouseover a': 'onMouseEnter'
			})

			eventBus.on(Action.ROUTE_TRANSITION_BEFORE_DOM_UPDATE, onExit)

			eventBus.on(Action.ROUTE_TRANSITION_AFTER_DOM_UPDATE, onEnter)

			NProgress.configure(progressOptions)

			return this
		}

		/** *
		 * @static goTo
		 * @memberof Router
		 * @param {Object} options
		 * @param {String} options.pathname - pathname for the page to navigate to
		 * @param {String} options.action - the type of history action
		 * @param {Object} options.dataAttrs - any data attributes on the link clicked
		 * @param {Object} transition - transition, a custom transition object
		 *
		 * @return {void}
		 */
		async goTo({ pathname, action, dataAttrs }, transition) {
			try {
				NProgress.start()

				const { newHtml } = await this.lifecycle.init({
					pathname,
					action,
					transition,
					dataAttrs
				})
				localLinks(newHtml)

				if (action === 'PUSH') {
					historyManager.push(pathname, { attr: dataAttrs })
				}
				NProgress.done()
			} catch (err) {
				eventBus.emit(Action.ROUTER_PAGE_NOT_FOUND, err)
				// eslint-disable-next-line
				console.warn(`[PREFETCH] no page found at ${err}`)
				window.location = pathname
			}
		}

		/** *
		 * @method onMouseEnter
		 * @memberof Router
		 * @description mouse enter event, triggers a fetch
		 * @param {Object} e - event object
		 * @param {HTMLElement} elm - the html element entered
		 *
		 * @return {void}
		 */
		onMouseEnter = (e, elm) => {
			const { href } = elm
			const pathname = href.replace(window.location.origin, '')
			const fromCache = cache.get(pathname)

			if (!preventClick(e, elm) || fromCache || Queue.size >= 4) {
				return
			}

			request(pathname).catch(err => {
				// eslint-disable-next-line
				console.warn(`[PREFETCH] no page found at ${pathname}`, err)
			})
		}

		/** *
		 * @method onClick
		 * @memberof Router
		 * @description mouse click event, triggers a fetch
		 * @param {Object} e - event object
		 * @param {HTMLElement} elm - the html element entered
		 *
		 * @return {void}
		 */
		onClick = (e, elm) => {
			const { href } = elm
			const pathname = href.replace(window.location.origin, '')

			if (!preventClick(e, elm)) {
				return
			}

			if (pathname === window.location.href.replace(window.location.origin, ''))
				return

			e.preventDefault()

			const dataAttrs = composeProps([...elm.attributes])

			lazyload.cancel()
			this.goTo({ pathname, dataAttrs, action: 'PUSH' })
		}

		/** *
		 * @method mount
		 * @memberof Router
		 * @description Called after instantiation, boots everything up
		 *
		 * @return {Router}
		 */
		mount = () => {
			eventBus.on(Action.ROUTER_POP_EVENT, ({ pathname }) => {
				this.lifecycle.init({ pathname, action: 'POP' })
			})

			eventBus.on(
				Action.ROUTE_TRANSITION_AFTER_DOM_UPDATE,
				({
					to: {
						params: { raw: url }
					}
				}) => {
					this.$links(url)
				}
			)

			localLinks(document)

			this.$events.attachAll()

			return this
		}

		/** *
		 * @method lazyload
		 * @memberof Router
		 * @description prefetch content on a service worker
		 *
		 * @return {Router}
		 */
		lazyload = () => {
			const items = [...document.querySelectorAll(this.prefetchTargets)]
			lazyload.fetch(items)
			return this
		}
	}
})()
