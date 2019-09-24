const fn1 = () => {
	console.log('f1')
}
const fn2 = () => {
	console.log('hello')
}

const set = new Set()

set.add(fn1)
set.add(fn2)

set.delete(fn1)
set.has(fn1) // ?

const item = [...set].forEach(a => a())
