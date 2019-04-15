/* global workbox self */

workbox.routing.registerRoute(
	/\.(?:js|css)$/,
	new workbox.strategies.StaleWhileRevalidate({
		cacheName: 'static-resources'
	})
)

workbox.routing.registerRoute(
	'//polyfill.io/v3/polyfill.min.js',
	new workbox.strategies.CacheFirst()
)

const networkFirstHandler = workbox.strategies.networkFirst({
	cacheName: 'default',
	plugins: [
		new workbox.expiration.Plugin({
			maxEntries: 20
		}),
		new workbox.cacheableResponse.Plugin({
			statuses: [200]
		})
	]
})

const matcher = ({ event }) => event.request.mode === 'navigate'
const handler = args =>
	networkFirstHandler
		.handle(args)
		.then(response => (!response ? caches.match('/offline.html') : response))

workbox.routing.registerRoute(matcher, handler)

workbox.precaching.precacheAndRoute(self.__precacheManifest) // eslint-disable-line no-restricted-globals
