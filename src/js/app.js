// @ts-check
import NProgress from 'nprogress'
import quicklink from 'quicklink/dist/quicklink'

import { loadApp, router } from '@/core'

const app = loadApp(document.body, {
	fetch: name =>
		import(/* webpackChunkName: "spon-[request]" */ `@/behaviours/${name}`)
})

app.use('routes', router, {
	settings: {
		rootNode: document.getElementById('page-test'),
		ignoreProp: 'data-no-route',
		pageSelector: '[data-route]',
		headers: {}
	}
})

const { routes } = app.plugins

NProgress.configure({
	showSpinner: true
})

app.on('route:before/onExit', () => {
	app.destroy()
	NProgress.start()
})

app.on('route:after/onEnter', () => {
	app.hydrate(document)
	NProgress.done()
})

app.on('route:history/change', ({ historyStack }) => {
	quicklink({
		ignores: [
			uri => {
				return !historyStack.stack.includes(uri)
			}
		]
	})
})

const loadViews = async () => {
	const { boxes } = await import('./views')
	routes.add('/components/preview/:id', boxes)
}

loadViews()
quicklink()
