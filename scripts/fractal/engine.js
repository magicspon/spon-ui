// const faker = require('faker')

module.exports = function templateEngine(stamp) {
	return {
		filters: {
			// to do
		},
		functions: {
			getStamp() {
				return {
					stamp
				}
			}
		}
	}
}
