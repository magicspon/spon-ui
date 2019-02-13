// A solution for React 16 complaining of missing rAF.
// import 'intersection-observer'

const jsdom = require('jsdom')
const { JSDOM } = jsdom

const dom = new JSDOM(
	'<!DOCTYPE html><html><head><style>body:after{content:"root";}</style></head><body></body></html>'
)

global.window = dom.window
global.document = dom.window.document
global.window.innerWidth = 1024

// Simulate window resize event
const resizeEvent = document.createEvent('Event')
resizeEvent.initEvent('resize', true, true)

global.window.resizeTo = (width, height) => {
	global.window.innerWidth = width || global.window.innerWidth
	global.window.innerHeight = height || global.window.innerHeight
	global.window.dispatchEvent(resizeEvent)
}

global.requestAnimationFrame = function(callback) {
	setTimeout(callback, 0)
}

Object.defineProperty(document, 'currentStyle', {
	value: document.createElement('style')
})

if (window.Element && !Element.prototype.closest) {
	Element.prototype.closest = function(s) {
		const matches = (this.document || this.ownerDocument).querySelectorAll(s)
		let i
		let el = this
		// eslint-disable-next-line no-cond-assign
		do {
			i = matches.length
			while (--i >= 0 && matches.item(i) !== el) {} // eslint-disable-line
		} while (i < 0 && (el = el.parentElement))
		return el
	}
}

window.matchMedia = jest.fn().mockImplementation(query => {
	return {
		matches: false,
		media: query,
		onchange: null,
		addListener: jest.fn(),
		removeListener: jest.fn()
	}
})

window.IntersectionObserver = jest.fn(function() {
	this.observe = jest.fn()
})
