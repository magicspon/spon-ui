const path = require('path')

module.exports = {
	description: 'Add js behaviour',
	prompts: [
		{
			type: 'input',
			name: 'name',
			message: 'What should it be called?',
			validate: value => {
				if (/.+/.test(value)) {
					return true
				}
				return 'name is required'
			}
		},
		{
			type: 'confirm',
			name: 'domEvents',
			message: 'Do you need to use dom events',
			default: false
		}
	],
	actions: () => {
		const base = path.resolve(process.cwd(), 'src/js/behaviours/')

		const actions = [
			{
				type: 'add',
				path: path.resolve(base, '{{name}}.js'),
				templateFile: path.resolve(__dirname, 'behaviour.js.hbs'),
				abortOnFail: true
			}
		]

		return actions
	}
}
