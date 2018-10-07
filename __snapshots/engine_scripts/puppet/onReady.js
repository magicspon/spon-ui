/* eslint-disable no-unused-vars, no-console */

module.exports = async (page, scenario, vp) => {
	console.log(`SCENARIO > ${scenario.label}`)
	await require('./clickAndHoverHelper')(page, scenario)

	// add more ready handlers here...
}
