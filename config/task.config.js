const path = require('path')

module.exports = (env, prefixUrls) => ({
	stamp: Date.now(),

	server: {
		open: false,
		browser: ['google chrome'],
		port: 3000,
		logLevel: 'info',
		watch: true,
		logFileChanges: true,

		watchOptions: {
			ignoreInitial: true,
			ignored: ['**/*.js', '**/*.scss', '!**/*.config.js', '**/*.json']
		},
		files: [
			{
				options: {
					ignored: '**/*.hot-update.json'
				}
			}
		]
		// https: {
		// 	key: path.resolve(process.env.PWD, 'private', 'key.pem'),
		// 	cert: path.resolve(process.env.PWD, 'private', 'cert.pem')
		// }
	},

	js: {
		publicPath: '/dist/js/',
		entries: {
			app:
				env !== 'production'
					? [
						'webpack/hot/dev-server',
						'webpack-hot-middleware/client',
						'./app.js'
					  ]
					: ['./app.js']
			// preview: ['./app.js']
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
		}
	},

	cssnanoOptions: {},

	critical: {
		minify: true,
		width: 1024,
		height: 768
	},

	purge: {
		whitelistPatterns: [
			/plyr/,
			/is-/,
			/has-/,
			/no-/,
			/icon--/,
			/lazy/,
			/headroom/,
			/modal/,
			/nprogress/
		],
		whitelistPatternsChildren: [/nprogress/]
	},

	fractal: {
		title: 'spon ui',
		layout: 'wrapper/_base.twig',
		base: '@base',
		context: {
			BASE_PATH: prefixUrls ? '/components/preview' : ''
		},
		collated: false,
		collator(markup, item) {
			return `<!-- Start: @${item.handle} -->
			<div style="margin: 0 0 40px 0;">
				<h3 style="font-size: 14px; margin: 0 0 20px; color: rgba(83, 83, 99, 0.5); padding: 10px 40px; background: rgba(83, 83, 99, 0.075)">${
	item.handle
	}</h3>
				<div style="padding: 20px 40px">
					\n${markup}\n
				</div>
			</div>
			<!-- End: @${item.handle} -->\n`
		},

		server: {},

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
	},

	backstop: {
		url: 'http://localhost:3000/components/preview/',
		defaults: {
			selectorExpansion: true,
			hideSelectors: [],
			removeSelectors: [],
			readyEvent: null,
			delay: 500,
			misMatchThreshold: 0.2,
			requireSameDimensions: true,
			selector: ['body']
		},

		config: {
			id: 'spon regression tests',
			viewports: [
				{
					label: 'phone',
					width: 320,
					height: 480
				},
				{
					label: 'tablet',
					width: 1024,
					height: 768
				}
			],
			onBeforeScript: 'puppet/onBefore.js',
			onReadyScript: 'puppet/onReady.js',
			scenarios: [],
			paths: {
				bitmaps_reference: '__snapshots/bitmaps_reference',
				bitmaps_test: '__snapshots/bitmaps_test',
				engine_scripts: '__snapshots/engine_scripts',
				html_report: '__snapshots/html_report',
				ci_report: '__snapshots/ci_report'
			},
			report: ['browser'],
			engine: 'puppeteer',
			engineOptions: {
				args: ['--no-sandbox']
			},
			asyncCaptureLimit: 5,
			asyncCompareLimit: 50,
			debug: false,
			debugWindow: false
		}
	}
})
