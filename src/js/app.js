/* eslint-disable no-console */

import { loadApp } from '@spon/core'

// loadModule({
// 	module: logger,
// 	id: 'hello',
// 	node: document.getElementById('logger'),
// 	keepAlive: true
// })

loadApp(name => import(`@/behaviours/${name}`), document.body)

// define a global hook

// barba.hooks.beforeEnter(({ next }) => {
// 	app.hydrate(next.container)
// })

// barba.hooks.afterLeave(() => {
// 	app.destroy()
// })
