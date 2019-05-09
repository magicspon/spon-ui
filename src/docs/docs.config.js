/* eslint-disable import/no-dynamic-require */
const R = require('ramda')
const path = require('path')
const resolveConfig = require('tailwindcss/resolveConfig')
const tailwindConfig = require(path.resolve(
	process.env.PWD,
	'src/scss/tailwind.config.js'
))

const { theme } = resolveConfig(tailwindConfig)

const colors = R.compose(
	R.reduce((acc, [key, value]) => {
		const isO = R.is(Object, value)

		if (isO) {
			return {
				...acc,
				...R.reduce(($acc, [$key, $value]) => {
					return {
						...$acc,
						[`${key}-${$key}`]: $value
					}
				}, {})(Object.entries(value))
			}
		}

		return { ...acc, [key]: value }
	}, {}),
	Object.entries
)(theme.colors)


console.log(JSON.stringify(theme.fontSize, null, 2))

module.exports = {
	context: {
		colors,
		spacing: theme.padding,
		screens: theme.screens,
		fonts: theme.fontFamily,
		fontSize: theme.fontSize,
		width: theme.width,
		maxWidth: theme.maxWidth,
		height: theme.height,
	}
}
