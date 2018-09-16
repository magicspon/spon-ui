const requireDir = require('require-dir')
const deepmerge = require('deepmerge')
const argList = require('./scripts/utils/argv')
const TASK_CONFIG = require('./scripts/task.config')
let PATH_CONFIG = require('./scripts/path.config.json')
const { config, env } = argList(process.argv)

if (config) {
	try {
		const pathConfig = require(`./scripts/path.config.${config}.json`) // eslint-disable-line import/no-dynamic-require
		PATH_CONFIG = deepmerge(PATH_CONFIG, pathConfig)
	} catch (e) {
		throw new Error(
			`scripts/path.config.${config}.json can not be found, ${e.name}: ${
				e.message
			}`
		)
	}
}

global.env = env || 'development'
global.PRODUCTION = global.env === 'production'
global.TASK_CONFIG = TASK_CONFIG
global.PATH_CONFIG = PATH_CONFIG
global.WEBPACK_CONFIG = require('./scripts/webpack/config.dev.js')(global.env)

requireDir('./scripts/tasks', {
	recurse: true
})
