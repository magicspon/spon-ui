const requireDir = require('require-dir')
const deepmerge = require('deepmerge')
const log = require('fancy-log')
const c = require('ansi-colors')
const argList = require('./scripts/utils/argv')
const TASK_CONFIG = require('./config/task.config')
let PATH_CONFIG = require('./config/path.config.json')
const { config, env } = argList(process.argv)

if (config) {
	try {
		const pathConfig = require(`./config/path.config.${config}.json`) // eslint-disable-line import/no-dynamic-require
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
global.config = config || 'default'
global.PRODUCTION = global.env === 'production'
global.TASK_CONFIG = TASK_CONFIG(env)
global.PATH_CONFIG = PATH_CONFIG
global.WEBPACK_CONFIG = require('./scripts/webpack/config.dev.js')

const color =
	config === 'cms' ? 'green' : config === 'fractal' ? 'cyan' : 'blue'

log(`${c[color](` 
	                 __        
	.--------.--.--.|  |.-----.
	|        |  |  ||  ||  _  |
	|__|__|__|_____||__||   __|
                            |__|
	`)}
	
	ENV: ${c.bold[color](global.env)}, CONFIG: ${c.bold[color](global.config)}\n
	`)

requireDir('./scripts/tasks', {
	recurse: true
})
