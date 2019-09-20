const names = [{ name: 'Bart' }, { name: 'Lisa' }, { name: 'Maggie' }]

function list(input) {
	return input.reduce((acc, { name }, index, { length }) => {
		const prefix = index === 0 ? '' : index === length - 1 ? ' &' : ','
		return `${acc}${prefix} ${name}`.trim()
	}, '')
}

list(names) // ?
const isAlpha = string =>
	Number.isNaN(parseInt(string.charAt(string.length - 1), 10))

function incrementString(string) {
	if (isAlpha(string)) return `${string}1`
	const num = parseInt(string.match(/\d+/)[0], 10)
	const inc = num + 1
	const index = string.indexOf(num.toString())
	const increasedDigits = inc.toString().length > num.toString().length

	return (
		string.substr(
			0,
			num === 0
				? string.length - 1
				: increasedDigits
					? isAlpha(string.charAt(index - 1))
						? index
						: index - 1
					: index
		) + inc
	)
}

incrementString('foobar') // ?
incrementString('foobar1') // ?
incrementString('foobar99') // ?
incrementString('foobar099') // ?
incrementString('foobar000') // ?

function towerBuilder(nFloors) {
	return Array.from({ length: nFloors }, (_, i) => i).reduceRight(
		(acc, _, index) => {
			const row = nFloors - index
			const spaces = ' '.repeat(index)
			const stars = '*'.repeat(row - 1 + row)
			return [...acc, `${spaces}${stars}${spaces}`]
		},
		[]
	)
}

towerBuilder(3) // ?

const re = RegExp(/a(b)/, 'g')
re.test('aabb') // ?

/**
 *
 * /a/g match a anywhere (case insensitive), use gi
 * /1.5/g the dot matches anything between the two characters
 * /a{4}/g match n 'a'
 *
 *
 */

function _chunk(value, data, skip = false) {
	return data.reduce((acc, item, index) => {
		if (index % value === 0) {
			const group = data.slice(index, value + index)
			if (!skip || (group.length >= value && skip)) {
				return [...acc, group]
			}
			return acc
		}
		return acc
	}, [])
}

function chunk(value, data) {
	return _chunk(value, data, false)
}

function chunkAndSkip(value, data) {
	return _chunk(value, data, true)
}

function reject(fn, data) {
	return data.filter((...args) => !fn(...args))
}

function groupBy(fn, data) {
	return [data.filter(fn), reject(fn, data)]
}

const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const people = [
	{ name: 'ted' },
	{ name: 'wayne' },
	{ name: 'ted' },
	{ name: 'clare' }
]

chunk(4, input) // ?
chunkAndSkip(4, input) // ?

groupBy(val => val > 4, input) // ?
groupBy(({ name }) => name === 'ted', people) // ?
