import cache from './cache'

const Queue = new Set()

export { Queue }
/**
 * @memberof RouterUtils
 * @function request
 *
 * @property {String} pathname - pathname to fetch
 * @property {Object} options - options to be used by fetch
 * @property {String} type - the type of response
 * @return {Promise}
 */

export default (
	pathname,
	options = {
		headers: {
			'X-SPONJS-ROUTE': 'true'
		}
	},
	type = 'text'
) =>
	new Promise(async resolve => {
		// are we in the cache... yeah... get me and return

		Queue.add(pathname)
		const fromCache = cache.get(pathname)

		if (fromCache && fromCache.status === 'cached') {
			resolve(cache.get(pathname).data)
			return
		}

		// no cache... lets fetch it
		cache.set(pathname, { status: 'loading' })

		const timer = setTimeout(() => {
			window.location = pathname
		}, 5000)

		/** *
		 * native fetch
		 *
		 * @param {String} - the pathname
		 * @param {Object} - any fetch options
		 *
		 * @return :promise
		 */
		const data = await fetch(pathname, options).then(response => {
			clearTimeout(timer)
			Queue.delete(pathname)

			const { ok, status, url } = response
			cache.set(pathname, { status: 'loaded' })
			if (ok) {
				// return the response transform
				// i.e. for html response.html(), or json: response.json()
				return response[type]()
			}

			// things are not so good....
			// object to hold all that went wrong
			const resp = {
				data: false,
				ok,
				status,
				url
			}
			return resp
		})

		// we have the goodies
		// add it to the cache

		if (data) {
			cache.set(pathname, {
				status: 'cached',
				data
			})
		}
		// we are done here... pass the response on
		resolve(data)
	})
