import { leadingSlashPath } from '@/core/utils/strings'

/**
 * @typedef {Object} Cache
 * @property {function} set Set an items into cache
 * @property {String} set.key Name of the item to cache
 * @property {Object} set.value Value of the item to cache
 * @property {function} get Get an item from the cache
 * @property {String} get.key Name of the item to get
 * @property {function} has Check if an item is in the cache
 * @property {String} has.key Name of the item to check
 */

/**
 * @memberof RouterUtils
 * @function cache
 * @description Wrapper around a Map. The keys are sanitized before adding
 * @return {Cache}
 */
const cache = (() => {
	const cache = new Map()

	return {
		set(key, value) {
			cache.set(leadingSlashPath(key), value)
		},

		get(key) {
			return cache.get(leadingSlashPath(key))
		},

		has(key) {
			return cache.has(leadingSlashPath(key))
		}
	}
})()

export default cache
