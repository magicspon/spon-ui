import { domEvents } from '../../src/js/core'

describe('test domEvents', () => {
	document.body.innerHTML = `<div id="test">
                              <a data-testid="button" href="#"></a>
                              <a data-testid="button2" href="#"></a>
                              <a href="#" data-c></a>
															<a href="#" data-d></a>
															<div id="inner">
																<a data-testid="button3" href="#"></a>
															</div>
														</div>`

	it('should be a function', () => {
		expect(domEvents).toBeInstanceOf(Function)
	})

	it('should return an object', () => {
		expect(domEvents()).toBeInstanceOf(Object)
	})

	it('should have the correct methods', () => {
		const { addEvents, removeEvents, removeEvent } = domEvents()

		expect(addEvents).toBeInstanceOf(Function)
		expect(removeEvents).toBeInstanceOf(Function)
		expect(removeEvent).toBeInstanceOf(Function)
	})

	it('should attach events', async () => {
		const container = document.getElementById('test')
		const node = container.querySelector('[data-testid="button"]')

		const { addEvents } = domEvents(container)
		const onClick1 = jest.fn()

		addEvents({
			'click [data-testid="button"]': onClick1
		})

		node.click()
		expect(onClick1).toHaveBeenCalledTimes(1)
	})

	it('should remove events', async () => {
		const container = document.getElementById('test')
		const node = container.querySelector('[data-testid="button"]')

		const { addEvents, removeEvents } = domEvents(container)
		const onClick1 = jest.fn()

		addEvents({
			'click [data-testid="button"]': onClick1
		})

		node.click()
		removeEvents()
		node.click()
		expect(onClick1).toHaveBeenCalledTimes(1)
	})

	it('should remove events by key', async () => {
		const container = document.getElementById('test')
		const node = container.querySelector('[data-testid="button"]')
		const node2 = container.querySelector('[data-testid="button2"]')

		const { addEvents, removeEvent } = domEvents(container)
		const onClick1 = jest.fn()
		const onClick2 = jest.fn()

		addEvents({
			'click [data-testid="button"]': onClick1,
			'click [data-testid="button2"]': onClick2
		})

		node.click()
		node2.click()
		removeEvent('click [data-testid="button"]')
		node.click()
		node2.click()
		expect(onClick1).toHaveBeenCalledTimes(1)
		expect(onClick2).toHaveBeenCalledTimes(2)
	})

	it('should let users define the root node when calling addEvents with two arguments', () => {
		const container = document.getElementById('test')
		const inner = document.getElementById('inner')
		const node = container.querySelector('[data-testid="button3"]')

		const { addEvents } = domEvents()
		const onClick1 = jest.fn()

		addEvents(inner, {
			'click [data-testid="button3"]': onClick1
		})

		node.click()
		expect(onClick1).toHaveBeenCalledTimes(1)
	})

	it('should call each method with two arguments', () => {
		const container = document.getElementById('test')
		const inner = document.getElementById('inner')
		const node = container.querySelector('[data-testid="button3"]')

		const { addEvents } = domEvents()
		let eventObject
		const onClick1 = jest.fn((e, node) => {
			eventObject = e
			node.classList.add('test')
		})

		addEvents(inner, {
			'click [data-testid="button3"]': onClick1
		})

		node.click()

		expect(eventObject).toBeInstanceOf(MouseEvent)
		expect(node.classList.contains('test')).toBe(true)
	})
})
