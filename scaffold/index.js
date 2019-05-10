const componentGenerator = require('./component/')
const behaviourGenerator = require('./behaviour/')

module.exports = plop => {
	plop.setGenerator('component', componentGenerator)
	plop.setGenerator('behaviour', behaviourGenerator)
}
