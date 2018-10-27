/* global workbox self */

workbox.skipWaiting()
workbox.clientsClaim()

/*
workbox.routing.registerRoute(
	new RegExp('https://local.ournameismud.co.uk'),
	workbox.strategies.staleWhileRevalidate()
)

workbox.routing.registerRoute(
	new RegExp('https://use.typekit.net/(.*)'),
	workbox.strategies.cacheFirst({
		cacheName: 'typekit',
		plugins: [
			new workbox.expiration.Plugin({
				maxEntries: 30,
				maxAgeSeconds: 365 * 1000 * 24 * 60 * 60 // 1000 years
			})
		]
	})
)

workbox.routing.registerRoute(
	new RegExp('https://mud-assets.imgix.net/(.*)'),
	workbox.strategies.cacheFirst({
		cacheName: 'typekit',
		plugins: [
			new workbox.expiration.Plugin({
				maxEntries: 30,
				maxAgeSeconds: 365 * 1000 * 24 * 60 * 60 // 1000 years
			})
		]
	})
)
*/

workbox.routing.registerRoute(
	/\.(?:png|gif|jpg|jpeg|svg|webp)$/,
	workbox.strategies.cacheFirst({
		cacheName: 'images',
		plugins: [
			new workbox.expiration.Plugin({
				maxEntries: 60,
				maxAgeSeconds: 365 * 1000 * 24 * 60 * 60 // 1000 years
			})
		]
	})
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
