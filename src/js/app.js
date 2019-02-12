// @ts-check
import NProgress from 'nprogress'
import '@/plugins/logger'
import { loadApp, router } from '@/core'

const app = loadApp(document.body)

app.use('routes', router)

const { routes } = app.plugins

NProgress.configure({
	showSpinner: true
})

app.on('route:before/onExit', () => {
	app.destroy()
	NProgress.start()
})

app.on('route:after/onEnter', () => {
	log('on enter')
	app.hydrate(document)
	NProgress.done()
})

const loadViews = async () => {
	const { boxes } = await import('./views')
	routes.add('boxes', boxes)
}

loadViews()
