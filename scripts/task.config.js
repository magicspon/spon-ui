const path = require('path')

module.exports = {
	stamp: Date.now(),

	server: {
		open: false,
		browser: ['google chrome'],
		port: 3000,
		logLevel: 'info'
		// https: {
		// 	key: path.resolve(process.env.PWD, 'private', 'key.pem'),
		// 	cert: path.resolve(process.env.PWD, 'private', 'cert.pem')
		// }
	},

	js: {
		publicPath: '/dist/js/',

		entries: {
			app: [
				'webpack/hot/dev-server',
				'webpack-hot-middleware/client',
				'./app.js'
			],
			preview: ['./app.js']
		},
		extensions: ['js', 'json'],
		extractSharedJs: false,
		filename: 'bundle' // no extension
	},

	scss: {
		options: {
			includePaths: [
				path.resolve(process.env.PWD, 'node_modules/normalize-scss/sass'),
				path.resolve(process.env.PWD, 'node_modules/susy/sass')
			]
		},

		postcss: {
			plugins: [
				require('postcss-write-svg')({
					encoding: 'base64'
				}),
				require('postcss-inline-svg')({
					path: path.resolve(process.env.PWD, 'static/img/')
				}),
				require('postcss-animation')(),
				require('postcss-easing-gradients')(),
				require('rucksack-css')(),
				require('tailwindcss')('./src/scss/tailwind.config.js'),
				require('autoprefixer')()
			]
		},

		cssnanoOptions: {}
	},

	fractal: {
		title: 'Mud-ui',
		layout: 'wrapper/_base.twig',
		context: {},
		statuses: {
			tool: {
				label: 'Prototype',
				description: 'Do not implement.',
				color: '#FF3333'
			},
			wip: {
				label: 'WIP',
				description: 'Work in progress. Implement with caution.',
				color: '#FF9233'
			},
			ready: {
				label: 'Ready',
				description: 'Ready to implement. Snapshot saved',
				color: '#4ae4ae'
			},
			test: {
				label: 'Test',
				description: 'Regression test',
				color: '#44aaee'
			},
			production: {
				label: 'Production',
				description: 'Component in production, regression tests approved',
				color: '#29CC29'
			}
		}
	}
}
