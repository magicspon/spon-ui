const a = 'a'
const b = 'b'

const cache = new Map([[a, { complext: 'a' }], [b, { complext: 'a' }]])

cache.get(a) // ?

cache.set(a, { ...cache.get(a), complext: '2' })

cache.get(a) // ?

cache.forEach(item => {
	item // ?
})
