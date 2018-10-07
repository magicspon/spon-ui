const requireDir = require('require-dir')
const deepmerge = require('deepmerge')
const log = require('fancy-log')
const c = require('ansi-colors')
const argList = require('./scripts/utils/argv')
const TASK = require('./config/task.config')
let PATHS = require('./config/path.config.json')
const { config, env, generate } = argList(process.argv)

if (config) {
	try {
		const pathConfig = require(`./config/path.config.${config}.json`) // eslint-disable-line import/no-dynamic-require
		PATHS = deepmerge(PATHS, pathConfig)
	} catch (e) {
		throw new Error(
			`scripts/path.config.${config}.json can not be found, ${e.name}: ${
				e.message
			}`
		)
	}
}

const prefixUrls = generate !== 'static-site'

global.env = env || 'development'
global.config = config || 'default'
global.PRODUCTION = global.env === 'production'
global.TASK = TASK(env, prefixUrls)
global.PATHS = PATHS
// after the above, some globals are used
global.WEBPACK_CONFIG = require('./scripts/webpack/config.base')

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
