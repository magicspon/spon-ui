import '@/plugins/logger'
import run from '@/core/'
import NProgress from 'nprogress'
import router from './router'

const app = run(document)

app.use('routes', router, {
	test: 10
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

const loadViews = async () => {
	const {
		sandbox
	} = await import(/* webpackChunkName: "spon-view" */ './views')

	routes.add('/components/preview/sandbox', sandbox)
}

loadViews()
