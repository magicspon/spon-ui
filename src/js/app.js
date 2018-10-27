import '@/plugins/logger'

import webfontloader from '@/plugins/webfontloader'
import 'lazysizes'

if (module.hot) {
	module.hot.accept()
}

webfontloader()

async function init() {
	const [App, routes] = await Promise.all([
		import(/* webpackChunkName: "chunk-app" */ '@/core/App'),
		import(/* webpackChunkName: "chunk-views" */ '@/views')
	])
	/* eslint-disable-next-line */
	new App.default({
		// @property {Array} routes - routes object
		// @property {HTMLElement} rootNode - the root html node
		// @property {Array} navLinks - an array of links that should update on navigation
		// @property {Object} classes - clases applied to active links
		// @property {Function} onExit - called before the dom is updated
		// @property {Function} function - called after the dom is updated

		router: {
			routes: routes.default,
			rootNode: document.getElementById('page-wrapper'),
			navLinks: [
				...document.querySelectorAll('header a'),
				...document.querySelectorAll('footer a')
			],
			classes: {
				match: 'is-current',
				root: 'is-current-root',
				parent: 'is-current-parent'
			},
			prefetchTargets: '[data-prefetch]',
			onExit() {},
			onEnter() {}
		},

		// @property {Function} routes - dynamic import of modules - function used by the loader
		chunks: behaviour =>
			import(/* webpackChunkName: "behaviour-[request]" */ `@/behaviours/${behaviour}`)
	}).mount()
}

init()
