module.exports = function(variants = ['responsive']) {
	const utils = {
		'.rotate--45': {
			transform: 'rotate(-45deg)'
		},
		'.rotate-45': {
			transform: 'rotate(45deg)'
		},
		'.rotate-90': {
			transform: 'rotate(90deg)'
		},
		'.rotate-180': {
			transform: 'rotate(180deg)'
		},
		'.rotate-270': {
			transform: 'rotate(270deg)'
		}
	}

	return function({ addUtilities }) {
		addUtilities(utils, variants)
	}
}
