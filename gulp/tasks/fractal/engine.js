const faker = require('faker')
const R = require('ramda')
const mdAbbr = require('markdown-it-abbr')
const mdFootnote = require('markdown-it-footnote')
const md = require('markdown-it')({
	html: true,
	xhtmlOut: true,
	typographer: true
})
	.use(mdAbbr)
	.use(mdFootnote)

const fs = require('fs')
const path = require('path')

const slugify = R.compose(
	R.replace(/[\s]+(.)?/g, (match, ch) => (ch ? `-${R.toLower(ch)}` : '')),
	R.toLower,
	R.trim,
	R.replace(/\s+/g, ' '),
	R.replace(/[^a-zA-Z\d\s:]/g, '')
)

function _titleCase(str) {
	return str
		.toLowerCase()
		.split(' ')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ')
}

const dir = path.resolve(
	process.env.PWD,
	PATH_CONFIG.src,
	PATH_CONFIG.fractal.src,
	'svgs'
)

function templateEngine(stamp) {
	return {
		filters: {
			markdown(str) {
				return md.render(str)
			},
			markdownInline(str) {
				return md.renderInline(str)
			},
			slugify(str) {
				return str.toLowerCase().replace(/[^\w]+/g, '')
			},
			stringify() {
				return JSON.stringify(this, null, '\t')
			},
			title(str, num = 3) {
				if (str) return str
				return _titleCase(faker.lorem.words(num))
			},
			lorem(str, num = 10) {
				if (str) return str
				return faker.lorem.words(num)
			},
			sentence(str, num = 10) {
				if (str) return str
				return faker.lorem.sentence(num)
			},
			para(str, num = 2) {
				if (str) return str
				return faker.lorem.paragraphs(num, '\n\n')
			},
			titleCase(str) {
				return _titleCase(str)
			},
			img(str, size = '800x600') {
				if (str) return
				return `https://source.unsplash.com/random/${size}`
			},
			
			
			kebab(src) {
				return slugify(src)
			},


			with(src, test) {
				const t = test[0]
				const keys = t._keys

				return src.filter(
					item => keys.filter(key => item[key] === t[key]).length
				)
			},

			without(input, o) {
				return input.filter(item => !o.includes(item))
			}
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
				return fs.readFileSync(`${dir}/${src}`, 'utf8')
			},

			ratio(arg) {
				const [x, y] = arg.split(':')

				return y / x
			}
		}
	}
}

function docsEngine() {
	return {
		filters: {
			markdown(str) {
				return md.render(str)
			},
			markdownInline(str) {
				return md.renderInline(str)
			},
			key(str, key) {
				return str[key]
			},
			slugify(str) {
				return str.toLowerCase().replace(/[^\w]+/g, '')
			},
			stringify() {
				return JSON.stringify(this, null, '\t')
			},
			first(str) {
				return str[0]
			},
			collection(val) {
				return Array(val).fill(0)
			},
			limit(array, count) {
				return array.slice(0, count)
			}
		},
		globals: {
			title: TASK_CONFIG.title
		}
	}
}

module.exports = {
	templateEngine,
	docsEngine
}
