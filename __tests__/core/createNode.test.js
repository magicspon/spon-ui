import { createNode } from '../../src/js/core'

describe('test createNode', () => {
	document.body.innerHTML =
		'<div style="transition: all 300ms ease" id="test" class="base-class" data-remove="a" data-test="20" data-other="40"></div>'

	it('should be a function', () => {
		expect(createNode).toBeInstanceOf(Function)
	})

	it('should return an object', () => {
		expect(createNode(document.getElementById('test'))).toBeInstanceOf(Object)
	})

	it('should return an object with a node object that is a HTMLElement', () => {
		const ref = createNode(document.getElementById('test'))

		expect(ref.node).toBeInstanceOf(HTMLElement)
	})

	it('should have a styler object', () => {
		const ref = createNode(document.getElementById('test'))

		ref.style.set({ color: 'red', x: 100 })
		ref.style.render()

		expect(ref.style).toBeInstanceOf(Object)
		expect(ref.node.style.cssText).toContain('color: red')
		expect(ref.node.style.cssText).toContain('translateX(100px)')
	})

	it('should be able to set classNames', () => {
		const ref = createNode(document.getElementById('test'))

		ref.className = 'extra-class'
		expect(ref.node.className).toBe('base-class extra-class')

		ref.className = 'different-class'
		expect(ref.node.className).toBe('base-class different-class')

		ref.addClass('waffles')
		expect(ref.node.className).toBe('base-class different-class waffles')

		ref.removeClass('base-class')

		expect(ref.node.className).toBe('different-class waffles')
	})

	it('should be able to read and write data-attributes', () => {
		const elm = document.getElementById('test')
		const ref = createNode(document.getElementById('test'))
		ref.data.add('onions')
		ref.data.test = 21

		expect(elm.hasAttribute('data-onions')).toBe(true)
		expect(elm.hasAttribute('data-remove')).toBe(true)
		ref.data.delete('remove')
		expect(ref.data.has('test')).toBe(true)
		expect(ref.data.has('remove')).toBe(false)
		expect(elm.getAttribute('data-test')).toBe('21')
		expect(ref.data.other).toBe('40')
	})

	// it('should have an promise event function', async () => {
	// 	const ref = createNode(document.getElementById('test'))
	// 	const onClick1 = jest.fn()

	// 	await ref
	// 		.addEvent('click', () => {
	// 			ref.style.set({ color: 'red', x: 1020 })
	// 		})
	// 		.then(onClick1)

	// 	expect(onClick1).toHaveBeenCalled()
	// })
})
