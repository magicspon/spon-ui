module.exports = function(variants = ['responsive']) {
	const utils = {
		'.trans': {
			transition: 'all 300ms ease'
		},
		'.trans-opacity': {
			'transition-property': 'opacity'
		},
		'.trans-transform': {
			'transition-property': 'transform'
		},
		'.trans-color': {
			'transition-property': 'color'
		},
		'.trans-b-color': {
			'transition-property': 'border-color'
		},
		'.trans-bg': {
			'transition-property': 'background-color'
		},
		'.trans-fast': {
			'transition-duration': '150ms'
		},
		'.trans-normal': {
			'transition-duration': '300ms'
		},
		'.trans-slow': {
			'transition-duration': '750ms'
		},
		'.trans-delay-none': {
			'transition-delay': '0ms'
		}
	}

	return function({ addUtilities }) {
		addUtilities(utils, variants)
	}
}
