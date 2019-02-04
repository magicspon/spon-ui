import '@/plugins/logger'
import run from '@/core/'
// import * as views from './views'

if (module.hot) {
	module.hot.accept()
}

const app = run(document)

app.on('route:before/onExit', () => {
	app.destroy()
})

app.on('route:after/onEnter', () => {
	app.hydrate(document)
})

const loadViews = async () => {
	const {
		sandbox,
		terry
	} = await import(/* webpackChunkName: "spon-view" */ './views')
	app.router.add('/components/preview/sandbox', sandbox)
	app.router.add('terry', terry)
}

// loadViews()
