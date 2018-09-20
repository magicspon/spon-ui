module.exports = compiler => ({
	middleware: [
		require('webpack-dev-middleware')(compiler, {
			stats: 'errors-only',
			publicPath: global.TASK.js.publicPath
		}),
		require('webpack-hot-middleware')(compiler)
	]
})
