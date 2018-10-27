import * as R from 'ramda'
import Worker from './fetch.worker.js'
import cache from './cache'
import { preventClick } from './utils/links'
import { inview } from '@/core/modules/inview'

/**
 * @typedef {Object} Lazyload
 * @property {function} load function to track items in the viewport and fetch
 * @property {Array} load.args an array of anchors
 *
 */

/**
 * Create a router
 * @memberof RouterUtils
 * @description fetch links within the viewport on a web worker
 * @function lazyload
 * @return {Lazyload}
 */

export default (() => {
	// setup a worker
	const worker = new Worker()
	// setup an array to store
	const errorLinks = []

	const getLinks = R.compose(
		// reject error items
		R.head,
		R.reject(key => R.contains(key)(errorLinks)),
		// ignore any that are in the cache
		R.filter(
			pathname => pathname !== window.location.pathname && !cache.has(pathname)
		),
		// just get the unique paths
		R.uniqBy(value => value),
		// grab the pathname
		R.map(R.prop('pathname'))
	)

	const viewport = inview(document, {
		enter({ isIntersecting, target }) {
			if (isIntersecting) {
				const link = getLinks([target])
				if (link) {
					// R.forEach(worker.postMessage)(links)
					cache.set(link, { status: 'loading' })
					worker.postMessage({ link })
				}

				return true
			}
		}
	})

	// add listen to events...
	worker.addEventListener('message', ({ data }) => {
		data.forEach(({ key, data }) => {
			// log(`fetched: ${key}`)
			if (data) {
				cache.set(key, { data, status: 'cached' })
			} else {
				if (!R.contains(key)(errorLinks)) {
					errorLinks.push(key)
				}
			}
		})
	})

	viewport.watch({
		selector: '[data-prefetch]'
	})

	return {
		fetch(nodes) {
			const validLinks = R.compose(
				R.take(10),
				R.filter(link => {
					const href = link.href.replace(window.location.origin, '')
					return !preventClick({}, href) && !cache.has(href)
				})
			)(nodes)

			viewport.destroy()

			viewport.watch({
				selector: validLinks
			})
		},

		cancel() {
			worker.postMessage('cancel')
		}
	}
})()
