import getRefs from '../../src/js/core/modules/refs'

describe('test createNode', () => {
	document.body.innerHTML = `<div id="node">
			<div data-ref="button" class="test" data-terry="10">Hello</div>
			<div data-ref="wibble" class="test" data-wendy="20">Hello</div>
		</div>`

	const node = document.getElementById('node')
	it('should be a function', () => {
		expect(getRefs).toBeInstanceOf(Function)
	})

	it('should return an object', () => {
		expect(getRefs(node)).toBeInstanceOf(Object)
	})

	it('should create refs for button and wibble', () => {
		const { button, wibble } = getRefs(node)

		expect(button).toBeInstanceOf(Object)
		expect(wibble).toBeInstanceOf(Object)
	})

	it('should create a ref item for each data-ref found', () => {
		const refs = getRefs(node)

		expect(Object.keys(refs).length).toBe(2)
	})

	it('should create a ref node for each item', () => {
		const { button } = getRefs(node)

		expect(button.node).toBeInstanceOf(HTMLElement)
		expect(button.style).toBeInstanceOf(Object)
		expect(button.data).toBeInstanceOf(Object)
		expect(button.addClass).toBeInstanceOf(Function)
		expect(button.removeClass).toBeInstanceOf(Function)
	})

	it('should have a styler object', () => {
		const { button } = getRefs(node)

		button.style.set({ color: 'red', x: 100 })
		button.style.render()

		expect(button.style).toBeInstanceOf(Object)
		expect(button.node.style.cssText).toContain('color: red')
		expect(button.node.style.cssText).toContain('translateX(100px)')
	})
})
