import { wait } from 'dom-testing-library'
import { loadApp, cache } from '../../src/js/core'

describe('test loadApp', () => {
	document.body.innerHTML = `<div id="root">
															<div data-spon="sandbox"></div>
															<div data-spon="sandbox" data-query="(min-width: 1000px)"></div>
															<div data-spon="sandbox"></div>
														</div>`

	let app
	let originalMatchMedia = window.matchMedia
	function createMockMediaMatcher(matches) {
		return () => ({
			matches,
			addListener: () => {},
			removeListener: () => {}
		})
	}

	beforeEach(() => {
		window.resizeTo(200, 1000)
		originalMatchMedia = window.matchMedia
	})

	afterEach(() => {
		window.matchMedia = originalMatchMedia
	})

	beforeAll(() => {
		app = loadApp(document.getElementById('root'))
	})

	it('should be a function', () => {
		expect(loadApp).toBeInstanceOf(Function)
	})

	it('should return an object', () => {
		expect(app).toBeInstanceOf(Object)
	})

	it('should return an object with the right methods', () => {
		expect(app.hydrate).toBeInstanceOf(Function)
		expect(app.destroy).toBeInstanceOf(Function)
	})

	it('should have eventBus events', () => {
		expect(app.on).toBeInstanceOf(Function)
		expect(app.off).toBeInstanceOf(Function)
		expect(app.emit).toBeInstanceOf(Function)
	})

	it('should add any valid data-spon nodes to the cache', async () => {
		await wait(() => {
			expect(cache.get('sandbox-0').hasLoaded).toBe(true)
			expect(cache.get('sandbox-1').hasLoaded).toBe(false)
			expect(cache.get('sandbox-2').hasLoaded).toBe(true)
		})
	})

	it('should load modules on resize if the query is true', async () => {
		window.resizeTo(1200, 1000)
		window.matchMedia = createMockMediaMatcher(true)

		await wait(() => {
			expect(cache.get('sandbox-1').hasLoaded).toBe(true)
		})
	})

	it('should unload modules on resize if the query is false', async () => {
		window.resizeTo(200, 1000)
		window.matchMedia = createMockMediaMatcher(false)

		await wait(() => {
			expect(cache.get('sandbox-1').hasLoaded).toBe(false)
		})
	})
})
