/* eslint-disable import/no-dynamic-require */

const path = require('path')
const config = require(path.resolve(
	process.env.PWD,
	'src/scss/tailwind.config.js'
))
const R = require('ramda')

const stripUnits = value =>
	Number((value || '').toString().replace(/[^\d\.-]/gi, '')) || null

const sortValues = R.compose(
	R.sortBy(item => item.value),
	R.map(item => {
		const value = stripUnits(item[1])
		return {
			key: item[0],
			value,
			px: `${value * 16}px`,
			rem: `${value}rem`
		}
	}),
	Object.entries
)

const type = R.compose(
	R.groupBy(item => (item.key.includes('ms-') ? 'ms' : 'fluid')),
	R.map(item => ({
		key: item[0],
		value: item[1]
	})),
	Object.entries
)(config.textSizes)

const sortMs = R.compose(
	R.sortBy(item => item.value),
	R.map(item => {
		const value = stripUnits(item.value)
		return {
			key: item.key,
			value,
			px: `${value * 16}px`,
			rem: `${value}rem`
		}
	})
)

const fluid = R.compose(
	R.reverse,
	R.sortBy(item => item.min),
	R.map(item => {
		const { min: minTmp, max: maxTmp } = item.value

		const min = {
			rem: minTmp,
			px: `${stripUnits(minTmp) * 16}px`
		}

		const max = {
			rem: maxTmp,
			px: `${stripUnits(maxTmp) * 16}px`
		}

		return { min, max, key: item.key }
	})
)

module.exports = {
	context: {
		colors: config.colors,
		fonts: config.fonts,
		breakpoints: config.screens,
		width: config.width,
		height: config.height,
		maxWidth: config.maxWidth,
		spacing: sortValues(config.margin),
		fluid: fluid(type.fluid),
		ms: sortMs(type.ms)
	}
}
