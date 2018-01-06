import ms from 'modularscale-js'

export function px2rem(input, base = 16) {
	const regExVal = new RegExp(/\d+/, 'g')
	return regExVal.exec(input) / base + 'rem'
}

export function calc(min, max, start, stop) {
	return `calc(${min} + (${max} - ${min}) * ((100vw - ${start}) / (${stop} - ${start})))`
}

export const ms2rem = (
	n,
	settings = {
		base: 16,
		ratio: 1.125
	}
) => px2rem(ms(n, settings))

export function msRange(
	start,
	end,
	settings = {
		base: 16,
		ratio: 1.125
	}
) {
	const length = end + 1 - start
	return Array.from({ length: length }).reduce((acc, cur, i) => {
		acc[`ms${start + i}`] = px2rem(ms(start + i, settings))
		return acc
	}, {})
}

export const gutter = (n = 1, size = 20) => px2rem(n * size)
