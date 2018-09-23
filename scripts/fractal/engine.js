const mdAbbr = require('markdown-it-abbr')
const mdFootnote = require('markdown-it-footnote')
const md = require('markdown-it')({
	html: true,
	xhtmlOut: true,
	typographer: true
})
	.use(mdAbbr)
	.use(mdFootnote)
// const fs = require('fs')
// const path = require('path')

const stripUnits = value => Number((value || '').toString().replace(/[^\d\.-]/gi, '')) || null

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
			json_encode(str) {
				return JSON.stringify(str, null, 2)
			}
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
