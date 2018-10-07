/* eslint-disable no-unused-vars, no-console */

module.exports = async (page, scenario, vp) => {
	await require('./loadCookies')(page, scenario)
}
