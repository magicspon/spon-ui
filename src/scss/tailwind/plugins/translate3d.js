module.exports = function(variants = ['responsive']) {
	const utils = {
		'.x--100': {
			transform: 'translate3d(-100%, 0, 0)'
		},
		'.x--50': {
			transform: 'translate3d(-50%, 0, 0)'
		},
		'.x-0': {
			transform: 'translate3d(0, 0, 0)'
		},
		'.x-50': {
			transform: 'translate3d(-50%, 0, 0)'
		},
		'.x-100': {
			transform: 'translate3d(100%, 0, 0)'
		},
		'.y--100': {
			transform: 'translate3d(0, -100%, 0)'
		},
		'.y--50': {
			transform: 'translate3d(0, -50%, 0)'
		},
		'.y-0': {
			transform: 'translate3d(0, 0, 0)'
		},
		'.y-50': {
			transform: 'translate3d(0, 50%, 0)'
		},
		'.y-100': {
			transform: 'translate3d(0, 100%, 0)'
		}
	}

	return function({ addUtilities }) {
		addUtilities(utils, variants)
	}
}
