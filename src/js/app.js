import '@/plugins/logger'
import run from '@/core/'

const app = run(document)

// app.on('route:before/onExit', () => {
// 	app.destroy()
// })

// app.on('route:after/onEnter', () => {
// 	app.hydrate(document)
// })

// const loadViews = async () => {
// 	const {
// 		sandbox
// 	} = await import(/* webpackChunkName: "spon-view" */ './views')
// 	app.router.add('/components/preview/sandbox', sandbox)
// }

// loadViews()
