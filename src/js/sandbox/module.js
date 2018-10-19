const R = require('ramda')

const ob = {
	lineItems: {
		'123': {
			id: '123',
			options: {
				type: 'app'
			}
		},
		'35324': {
			id: '35324',
			options: {
				type: 'desktop'
			}
		}
	}
}

R.compose(
	// R.filter(item => item.type === 'app'),
	// R.pluck('options'),

	// R.map(([key, value]) => value),
	Object.entries,
	R.prop('lineItems')
)(ob) // ?
