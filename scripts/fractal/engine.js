const fs = require('fs')
const path = require('path')
const mdAbbr = require('markdown-it-abbr')
const mdFootnote = require('markdown-it-footnote')
const md = require('markdown-it')({
	html: true,
	xhtmlOut: true,
	typographer: true
})
	.use(mdAbbr)
	.use(mdFootnote)

const { getPublicPath } = require('../utils/paths')
// const fs = require('fs')
// const path = require('path')

const stripUnits = value =>
	Number((value || '').toString().replace(/[^\d\.-]/gi, '')) || null

module.exports = function templateEngine(stamp) {
	return {
		filters: {
			markdown(str) {
				return md.render(str)
			},
			markdownInline(str) {
				return md.renderInline(str)
			},
			rem2px(str) {
				return `${stripUnits(str) * 16}px`
			},
			json_encode: str => JSON.stringify(str, null, 2),

			// TO DO... implement these filters
			// https://docs.craftcms.com/v3/dev/filters.html
			camel: str => str,
			kebab: str => str,
			lcfirst: str => str,
			snake: str => str,
			ucfirst: str => str,

			values: arr => arr,
			without: arr => arr
		},
		functions: {
			getStamp() {
				return {
					stamp
				}
			},

			// craftcms form function
			csrfInput() {},

			source(src) {
				return fs.readFileSync(getPublicPath(src), 'utf8')
			}
		}
	}
}
