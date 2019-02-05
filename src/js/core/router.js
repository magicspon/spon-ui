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
			fn(resolve)
		})
	})
}

const getTransition = transitions => {
	return (key, pathname) => {
		return transitions[key || pathname] || transitions.default
	}
}

const transitions = {
	default: {
		name: 'default',
		container: createNode(document.getElementById('page-wrapper')),

		async clearDom(html) {
			const { node, style, addEvent } = html
			return addEvent('transitionend', () => {
				style.set({ opacity: 0 })
			}).then(() => {
				node.parentNode.removeChild(node)
			})
		},

		async onExit({ update, prevHtml }) {
			await update(next => {
				this.clearDom(prevHtml).then(() => {
					next()
				})
			})
		},

		async onEnter({ update, newHtml }) {
			const { node, style, addEvent } = newHtml
			style.set({ opacity: 0 })
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

const router = store => {
	const history = createHistory()
	// const debug = document.getElementById('debug')
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
				const getTrans = getTransition(transitions)
				const prevTransition = getTrans(state.key, prev.params.pathname)
				const nextTransition = getTrans(getKey(doc), pathname)
				const newHtml = createNode(doc.querySelector('[data-route]'))

				quicklink({
					ignores: [
						uri => {
							return !Object.keys(cache).includes(uri)
						}
					]
				})

				await Object.assign({}, transitions.default, prevTransition).onExit({
					prevHtml,
					newHtml,
					params,
					update,
					prev
				})

				if (action !== 'POP') {
					history.push(params.pathname, params)
				}
				eventBus.emit('route:before/onEnter')

				await Object.assign({}, transitions.default, nextTransition).onEnter({
					html: doc,
					params,
					newHtml,
					prevHtml,
					update,
					prev
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
				fn({ store, transitions })
			)
		}
	}
}

export default router
