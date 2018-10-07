module.exports = {
	status: 'test',

	context: {
		options: {}
	},

	variants: [
		{
			name: 'update',
			context: {
				options: {
					updateText: true
				}
			}
		}
	]
}
