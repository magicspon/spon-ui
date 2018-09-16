// const faker = require('faker')

function templateEngine(stamp) {
	return {
		filters: {},
		functions: {
			getStamp() {
				return stamp
			}
		}
	}
}

module.exports = {
	templateEngine
}
