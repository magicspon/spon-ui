import url from 'url-parse'
import quicklink from 'quicklink/dist/quicklink.mjs'
import createHistory from 'history/createBrowserHistory'
import sync from 'framesync'
import domEvents from './domEvents'
import { createNode } from './refs'
import { bindStoreToRender, preventClick } from './utils'
import eventBus from './eventBus'

const parser = new DOMParser()

const getKey = context => {
	const target = context.querySelector('[data-route]')
	if (!target) return false

	const { route: transitionName } = target.dataset
	const key = transitionName.length > 0 ? transitionName : false
	return key
}

const update = fn => {
	return new Promise(resolve => {
		sync.render(() => {
			fn({ next: resolve })
		})
	})
}

const router = store => {
	const history = createHistory()
	// const debug = document.getElementById('debug')
	const transitions = {
		default: {
			container: createNode(document.getElementById('page-wrapper')),

			async onExit({ update, rootNode }) {
				const { node, style, addEvent } = rootNode
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
				this.container.node.appendChild(node)
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

	const render = bindStoreToRender(store)
	const del = domEvents(document.body)

	let prevHtml = null
	let action

	quicklink({
		origins: ['localhost']
	})

	const goTo = async params => {
		const key = getKey(document)
		const rootNode = createNode(document.querySelector('[data-route]'))
		prevHtml = rootNode
		eventBus.emit('route:before/onExit')
		await store.dispatch({
			type: 'router/fetchPage',
			payload: { ...params, key: key || null }
		})
		eventBus.emit('route:after/onExit')
	}

	history.listen(async (location, event) => {
		const { state: params } = location
		action = event
		if (event === 'POP') {
			const key = getKey(document)
			const rootNode = createNode(document.querySelector('[data-route]'))
			prevHtml = rootNode
			eventBus.emit('route:before/onExit')
			await store.dispatch({
				type: 'router/fetchPage',
				payload: {
					...params,
					href: store.getState().router.prevUrl,
					key: key || null
				}
			})
			eventBus.emit('route:after/onExit')
		}
	})

	del.addEvents({
		'click a': async (e, elm) => {
			if (preventClick(e, elm)) {
				// if (preventClick(e, elm)) return
				e.preventDefault()
				const { href } = elm
				const params = url(href)
				if (history.location.pathname === params.pathname) {
					Promise.resolve()
					return
				}

				goTo(params)
			}
		}
	})

	store.subscribe(
		render(
			async ({ prev: { router: prev }, current: { router: state } }) => {
				const { cache, html, params } = state
				const { pathname } = params
				const doc = parser.parseFromString(html, 'text/html')
				const newKey = getKey(doc)
				const prevTransition =
					transitions[state.key || prev.params.pathname] || transitions.default
				const transition =
					transitions[newKey || pathname] || transitions.default
				const newHtml = createNode(doc.querySelector('[data-route]'))

				quicklink({
					ignores: [
						uri => {
							return !Object.keys(cache).includes(uri)
						}
					]
				})

				await prevTransition.onExit({
					rootNode: prevHtml,
					params,
					update
				})

				if (action !== 'POP') {
					history.push(params.pathname, params)
				}
				eventBus.emit('route:before/onEnter')

				await transition.onEnter({
					html: doc,
					params,
					newHtml,
					prevHtml,
					update
				})
				eventBus.emit('route:after/onEnter')
			},
			['router']
		)
	)

	return {
		add(path, fn) {
			transitions[path] = Object.assign(
				{},
				{
					container: createNode(document.getElementById('page-wrapper'))
				},
				fn({ store })
			)
		}
	}
}

export default router
