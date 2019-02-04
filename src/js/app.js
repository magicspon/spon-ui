import url from 'url-parse'
import '@/plugins/logger'
import quicklink from 'quicklink/dist/quicklink.mjs'
import run from '@/core/loader'
import domEvents from '@/core/domEvents'
import store from '@/store'
import { bindStoreToRender } from '@/core/utils'

if (module.hot) {
	module.hot.accept()
}

quicklink({
	origins: ['localhost']
})

const app = run(document)

app.hydrate()
const parser = new DOMParser()

const getKey = context => {
	const target = context.querySelector('[data-route]')
	if (!target) return false

	const { route: transitionName } = target.dataset
	const key = transitionName.length > 0 ? transitionName : false
	return key
}

const router = (() => {
	const transitions = {}
	const render = bindStoreToRender(store)
	const del = domEvents(document.body)

	del.addEvents({
		'click a': async (e, elm) => {
			e.preventDefault()
			const { href } = elm
			const params = url(href)
			const key = getKey(document)
			const transition =
				transitions[key || params.pathname] || transitions.default

			await transition.onExit({
				update: fn => {
					return new Promise(resolve => {
						fn({ next: resolve })
					})
				}
			})
			store.dispatch({ type: 'router/fetchPage', payload: params })
		}
	})

	store.subscribe(
		render(
			async ({ current: state }) => {
				const {
					router: {
						cache,
						current: { html, params }
					}
				} = state

				const { pathname } = params

				const doc = parser.parseFromString(html, 'text/html')
				const key = getKey(doc)

				// ignore cached links
				quicklink({
					ignores: [
						uri => {
							return !Object.keys(cache).includes(uri)
						}
					]
				})

				const transition = transitions[key || pathname] || transitions.default
				log('start')
				await transition.onEnter({
					html,
					update: fn => {
						return new Promise(resolve => {
							fn({ doc, next: resolve })
						})
					}
				})
				log('end')
			},
			['router']
		)
	)

	return {
		add(path, fn) {
			transitions[path] = fn({ store })
		}
	}
})()

router.add('default', ({ store }) => {
	return {
		onExit: async ({ update }) => {
			await update(({ doc, next }) => {
				next()
			})
		},

		onEnter: async ({ update }) => {
			await update(({ doc, next }) => {
				next()
			})
		}
	}
})

// router.add('/components/preview/sandbox', current => {
// 	log('path', current)
// })

// router.add('terry', current => {
// 	log('name', current)
// })
