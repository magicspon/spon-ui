import createRefs from '@/core/modules/refs'

describe('create refs function', () => {
	document.body.innerHTML = `<div id="test">
                              <b data-element="mod1" data-prop-1="a" data-prop2="b"></b>
                              <b data-element="mod2" data-prop-1="a" data-prop2="b"></b>
                              <b data-element="mod3" data-prop-1="a" data-prop2="b"></b>
                              <b data-element="mod4" data-prop-1="a" data-prop2="b"></b>
                            </div>`

	let ref

	beforeAll(() => {
		ref = createRefs(document.getElementById('test'))
	})

	it('should be a function', () => {
		expect(createRefs).toBeInstanceOf(Function)
	})

	it('should return an object', () => {
		expect(ref).toBeInstanceOf(Object)
	})

	it('should return the correct number of items [4]', () => {
		expect(Object.keys(ref).length).toBe(4)
	})

	it('should return an object with each key containing the dom node and any data attributes', () => {
		const target = {
			mod1: {
				node: document.querySelector('[data-element="mod1"]'),
				prop1: 'a',
				prop2: 'b'
			}
		}

		const result = ref

		expect(result).toMatchObject(target)
	})
})
