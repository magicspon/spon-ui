module.exports = compiler => ({
	middleware: [
		require('webpack-dev-middleware')(compiler, {
			stats: 'errors-only',
			publicPath: TASK_CONFIG.js.publicPath
		}),
		require('webpack-hot-middleware')(compiler)
	]
})
