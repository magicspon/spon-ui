const webpack = require('webpack')
const DashboardPlugin = require('webpack-dashboard/plugin')


module.exports = {
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"development"'
			}
		}),
		new DashboardPlugin()
	]
}
