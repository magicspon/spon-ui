// import NProgress from 'nprogress'

import { loadApp } from '@spon/core'

loadApp(document.body, {
	fetch: name =>
		import(/* webpackChunkName: "spon-[request]" */ `@/behaviours/${name}`)
})

// app.use('routes', router)

// const { routes } = app.plugins

// NProgress.configure({
// 	showSpinner: true
// })

// app.on('route:before/onExit', () => {
// 	app.destroy()
// 	NProgress.start()
// })

// app.on('route:after/onEnter', () => {
// 	console.log('on enter')
// 	app.hydrate(document)
// 	NProgress.done()
// })

// const loadViews = async () => {
// 	const { boxes } = await import('./views')
// 	routes.add('boxes', boxes)
// }

// loadViews()
