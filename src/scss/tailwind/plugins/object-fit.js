module.exports = function(variants = ['responsive']) {
	const utils = {
		'.object-cover': {
			'object-fit': 'cover'
		},
		'.object-fill': {
			'object-fit': 'fill'
		},
		'.object-none': {
			'object-fit': 'none'
		},
		'.object-scale-down': {
			'object-fit': 'scale-down'
		},
		'.object-contain': {
			'object-fit': 'contain'
		},
		'.object-fit-center': {
			'object-position': 'center center'
		}
	}

	return function({ addUtilities }) {
		addUtilities(utils, variants)
	}
}
