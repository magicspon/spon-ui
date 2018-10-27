module.exports = {
	status: 'test',

	context: {
		key: 'default',
		options: {
			closeOthers: true
		}
	},

	variants: [
		{
			name: 'multiple',
			key: 'multiple',
			context: {
				options: {
					closeOthers: false,
					activeIndex: 1
				}
			}
		}
	]
}
