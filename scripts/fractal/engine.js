// const faker = require('faker')

module.exports = function templateEngine(stamp) {
	return {
		filters: {},
		functions: {
			getStamp() {
				return {
					stamp
				}
			}
		}
	}
}
