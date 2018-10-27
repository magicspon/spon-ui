const R = require('ramda')
const backstopjs = require('backstopjs')
const fractal = require('../fractal/core')
const argList = require('../utils/argv')

const { backstop: task } = argList(process.argv)

const regressionTest = async done => {
	const server = fractal.web.server()
	const logger = fractal.cli.console

	const {
		backstop: { url, defaults, config }
	} = global.TASK

	await server.start()
	logger.success('Fractal server started')

	const components = fractal.components.flattenDeep().toArray()

	const scenarios = R.compose(
		R.map(({ handle, context }) => {
			const key = handle.split('--default')[0]

			const selector = context.selector || 'body'

			return {
				...defaults,
				url: `${url}${key}`,
				label: key,
				selector: [`${selector}`],
				...context.backstop
			}
		}),
		R.filter(item => item.status.label.toLowerCase() === 'test')
	)(components)

	const backstopConfig = {
		...config,
		scenarios
	}

	logger.success(`regression ${task} started`)

	await backstopjs(task, { config: backstopConfig })

	server.stop()
	logger.success('regression test complete')

	done()
}

module.exports = regressionTest
