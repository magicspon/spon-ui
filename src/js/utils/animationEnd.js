export default type => {
	let types
	if (type && ('transition' === type || 'trans' === type)) {
		types = {
			OTransition: 'oTransitionEnd',
			WebkitTransition: 'webkitTransitionEnd',
			MozTransition: 'transitionend',
			transition: 'transitionend'
		}
	} else {
		// animation is default
		types = {
			OAnimation: 'oAnimationEnd',
			WebkitAnimation: 'webkitAnimationEnd',
			MozAnimation: 'animationend',
			animation: 'animationend'
		}
	}
	const elem = document.createElement('fake')
	return Object.keys(types).reduce(function(prev, trans) {
		return undefined !== elem.style[trans] ? types[trans] : prev
	}, '')
}
