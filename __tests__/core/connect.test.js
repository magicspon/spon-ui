import { init } from '@rematch/core'
import { connect as bindConnect, registerPlugin } from '../../src/js/core'

let store

describe('connect', () => {
	document.body.innerHTML =
		'<div style="transition: all 300ms ease" id="test" class="base-class" data-test="20" data-other="40"></div>'

	beforeEach(() => {
		store = init({
			models: {
				point: {
					state: {
						x: 0,
						y: 0
					},
					reducers: {
						move: (state, payload) => {
							const { x, y } = state
							const { x: nx = 0, y: ny = 0 } = payload
							return {
								...state,
								x: x + nx,
								y: y + ny
							}
						}
					},
					effects: {}
				}
			}
		})
	})

	it('should be a function', () => {
		expect(bindConnect).toBeInstanceOf(Function)
	})

	it('should return a function when called with store and registerFunk', () => {
		const connect = bindConnect(store, registerPlugin)
		expect(connect).toBeInstanceOf(Function)
	})

	it('should compose modules with store and plugin props', () => {
		const connect = bindConnect(store, registerPlugin)
		const node = document.getElementById('test')
		// get the cart state
		const mapState = ({ point }) => ({ point })
		// get all of the point actions
		const mapDispatch = ({ point }) => ({ ...point })
		let result = 0

		const mod = ({ a, plugins: { b }, store: { move } }) => {
			result = a + b

			move({ x: 20 })
		}

		const plugin = ({ node }) => {
			node.classList.add('test')
			return { b: 2 }
		}

		const merge = connect({
			store: [mapState, mapDispatch],
			plugins: [plugin]
		})(mod)

		expect(merge).toBeInstanceOf(Function)

		merge({ node, a: 10 })

		expect(result).toBe(12)
		expect(store.getState().point.x).toBe(20)
		expect(node.classList.contains('test')).toBe(true)
	})

	it('should compose modules with just plugin props', () => {
		const connect = bindConnect(store, registerPlugin)

		let result = 0

		const mod = ({ a, plugins: { b } }) => {
			result = a + b
		}

		const plugin = () => {
			return { b: 2 }
		}

		const merge = connect({
			plugins: [plugin]
		})(mod)

		merge({ a: 10 })
		expect(result).toBe(12)
	})

	it('should compose modules with just store props', () => {
		const connect = bindConnect(store, registerPlugin)
		// get the cart state
		const mapState = ({ point }) => ({ point })
		// get all of the point actions
		const mapDispatch = ({ point }) => ({ ...point })

		const mod = ({ store: { move } }) => {
			move({ x: 20 })
		}

		const merge = connect({
			store: [mapState, mapDispatch]
		})(mod)

		expect(merge).toBeInstanceOf(Function)

		merge({})

		expect(store.getState().point.x).toBe(20)
	})
})
