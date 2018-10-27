/* eslint-disable no-console */

const delay = delay => new Promise(resolve => setTimeout(resolve, delay))

class Lifecycle {
	constructor({ routes, wrapper }) {
		this.routes = routes
		this.wrapper = wrapper
	}

	async init() {
		this.argh = 10

		await Promise.all([this.onExit(), this.onFetch()])

		console.log('hello')
	}

	async onExit() {
		this.chump = 10
		await delay(500)
		console.log('onExit')
	}

	async onFetch() {
		this.chumper = 10
		await delay(1000)
		console.log('onFetch')
	}
}

const a = new Lifecycle({
	routes: [],
	wrapper: undefined
})

a.init()
