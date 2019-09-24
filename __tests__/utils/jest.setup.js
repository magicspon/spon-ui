// https://github.com/storybookjs/storybook/tree/master/addons/storyshots/storyshots-core
// import '@babel/polyfill'
import '@testing-library/jest-dom/extend-expect'

// this is the jest setupTestFrameworkScriptFile

// here we set up a fake localStorage because jsdom doesn't support it
// https://github.com/tmpvar/jsdom/issues/1137
if (!window.localStorage) {
	window.localStorage = {}

	Object.assign(window.localStorage, {
		removeItem: function removeItem(key) {
			delete this[key]
		}.bind(window.localStorage),
		setItem: function setItem(key, val) {
			this[key] = String(val)
		}.bind(window.localStorage),
		getItem: function getItem(key) {
			return this[key]
		}.bind(window.localStorage)
	})
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
