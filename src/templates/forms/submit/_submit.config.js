module.exports = {
	context: {
		attr: ''
	},

	variants: [
		{
			name: 'loading',
			context: {
				attr: 'data-loading'
			}
		},
		{
			name: 'disabled',
			context: {
				attr: 'disabled'
			}
		}
	]
}
