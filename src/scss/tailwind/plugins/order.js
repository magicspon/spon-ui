module.exports = function(variants = ['responsive']) {
	const utils = {
		'.order-1': {
			order: '1'
		},
		'.order-2': {
			order: '2'
		},
		'.order-3': {
			order: '3'
		},
		'.order-4': {
			order: '4'
		}
	}

	return function({ addUtilities }) {
		addUtilities(utils, variants)
	}
}
