import once from 'lodash.once'

export default (event, element, callback) => {
	function onEnd(resolve) {
		resolve()
		element.removeEventListener(event, onEnd)
	}

	return new Promise(resolve => {
		element.addEventListener(event, once(onEnd.bind(null, resolve)))
		callback()
	})
}
