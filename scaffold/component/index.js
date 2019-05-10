const path = require('path')

const getFolderFromType = key =>
	({
		object: '01-objects',
		forms: '02-forms',
		components: '03-components',
		global: '04-global',
		ui: '05-ui',
		container: 'container'
	}[key])

module.exports = {
	description: 'Add component',
	prompts: [
		{
			type: 'list',
			name: 'type',
			message: 'What do you want to create?',
			default: 'component',
			choices: () => [
				'components',
				'object',
				'global',
				'forms',
				'ui',
				'container'
			]
		},
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
		}
	],
	actions: data => {
		const { type } = data
		const prefix = type === 'container' ? '_' : ''

		const base = path.resolve(
			process.cwd(),
			`src/templates/${getFolderFromType(type)}/${prefix}{{name}}/`
		)

		const actions = [
			{
				type: 'add',
				path: path.resolve(base, '{{name}}.twig'),
				templateFile: path.resolve(__dirname, 'template.twig.hbs'),
				abortOnFail: true
			},
			{
				type: 'add',
				path: path.resolve(base, '_{{name}}.scss'),
				templateFile: path.resolve(__dirname, 'style.scss.hbs'),
				abortOnFail: true
			},
			{
				type: 'add',
				path: path.resolve(base, '{{name}}.config.js'),
				templateFile: path.resolve(__dirname, 'config.js.hbs'),
				abortOnFail: true
			},
			{
				type: 'add',
				path: path.resolve(base, 'README.md'),
				templateFile: path.resolve(__dirname, 'README.md.hbs'),
				abortOnFail: true
			}
		]

		return actions
	}
}
