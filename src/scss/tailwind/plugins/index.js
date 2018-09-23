const R = require('ramda')
const { numRange } = require('../tailwind.utils')

module.exports = {
	plugins: [
		require('tailwindcss-fluid')({
			textSizes: true
		}),

		// https://github.com/bradlc/tailwindcss-alpha
		require('tailwindcss-alpha')({
			modules: {
				backgroundColors: true,
				borderColors: true,
				textColors: true
			},
			alpha: ((from, to) =>
				R.reduce((acc, curr) => {
					acc[`${curr * 10}`] = curr / 10
					return acc
				}, {})(numRange(from, to, value => value)))(0, 10)
		}),

		require('tailwindcss-visuallyhidden')(),
		require('./order')(),
		require('./object-fit')(),
		require('./rotate')(),
		require('./translate3d')(['responsive', 'hover', 'group-hover']),
		require('./transition')(['responsive', 'hover']),

		// position fix perf fix
		function({ addUtilities }) {
			addUtilities(
				{
					'.perf-fixed': {
						position: 'fixed',
						transform: 'translateZ(0)'
					}
				},
				{
					variants: ['responsive']
				}
			)
		},

		// pins
		function({ addUtilities }) {
			addUtilities(
				{
					'.pin-l--50': {
						left: '-50%'
					},
					'.pin-l--100': {
						left: '-100%'
					},
					'.pin-l-50': {
						left: '50%'
					},
					'.pin-l-100': {
						left: '100%'
					},
					'.pin-r--50': {
						right: '-50%'
					},
					'.pin-r--100': {
						right: '-100%'
					},
					'.pin-r-50': {
						right: '50%'
					},
					'.pin-r-100': {
						right: '100%'
					},
					'.pin-t-50': {
						top: '50%'
					},
					'.pin-t-100': {
						top: '100%'
					},
					'.pin-t--50': {
						top: '-50%'
					},
					'.pin-t--100': {
						top: '-100%'
					},
					'.pin-b--50': {
						bottom: '-50%'
					},
					'.pin-b--100': {
						bottom: '-100%'
					},
					'.pin-b-50': {
						bottom: '50%'
					},
					'.pin-b-100': {
						bottom: '100%'
					}
				},
				{
					variants: ['responsive']
				}
			)
		}
	]
}
