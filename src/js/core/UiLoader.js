/* eslint-disable no-new */
import * as R from 'ramda'
import throttle from 'raf-throttle'
import eventBus from '@/core/modules/eventBus'

/**
 * @namespace UI
 * @description lazyload data-ui components
 *
 */
export default (() => {
	const cache = new Map()

	const scan = () => {
		cache.forEach(async item => {
			const { query, key, behaviour, node, options, module, hasLoaded } = item
			// has the item already been loaded
			if (hasLoaded) {
				// if the query no longer passes call the unmount method
				if (query && !window.matchMedia(query).matches) {
					module.unmount()
					// update the cache
					cache.set(key, {
						...item,
						hasLoaded: false
					})

					eventBus.emit(`ui/${key}:unmount`, cache.get(key))
				}

				return
			}

			// if there is a query and it matches, or if there is no query at all
			if (window.matchMedia(query).matches || typeof query === 'undefined') {
				// if we haven't already constructured the behaviour
				if (!module) {
					// fetch the behaviour
					const resp = await import(/* webpackChunkName: "ui-[request]" */ `@/ui/${behaviour}`)
					const { default: Ui } = resp
					let settings = {
						key
					}

					if (options) {
						settings = { ...settings, ...JSON.parse(options) }
					}

					const module = new Ui(node, settings)

					module.mount()

					cache.set(key, {
						...item,
						module,
						options: settings,
						hasLoaded: true
					})

					setTimeout(() => {
						eventBus.emit(`ui/${key}:mount`, cache.get(key))
					})
				} else {
					// we've already contructred the behaviour
					// we just need to remount it
					module.mount()

					cache.set(key, {
						...item,
						hasLoaded: true
					})

					setTimeout(() => {
						eventBus.emit(`ui/${key}:mount`, cache.get(key))
					})
				}
			}
		})
	}

	const hydrate = (context = document) => {
		R.compose(
			R.forEach(item => {
				const { key } = item
				cache.set(key, item)
			}),
			R.flatten,
			R.map(node =>
				R.compose(
					R.map(behaviour => {
						const { key, uiOptions: options, query } = node.dataset
						if (!key) {
							throw new Error('ui components must have a unique key')
						}

						return {
							behaviour,
							node,
							key,
							options,
							query,
							hasLoaded: false
						}
					}),
					R.split(' '),
					R.replace(/^\s+|\s+$|\s+(?=\s)/g, '')
				)(node.getAttribute('data-ui'))
			)
		)([...context.querySelectorAll('*[data-ui]')])

		scan()
	}

	const destroy = (selector = '.page-child') => {
		cache.forEach(({ module, key, hasLoaded, node }) => {
			if (hasLoaded && node.closest(selector)) {
				module.destroy()
				cache.delete(key)
			}
		})
	}

	const handle = throttle(scan)

	window.addEventListener('resize', handle, false)

	return {
		hydrate,

		destroy,

		cache
	}
})()
