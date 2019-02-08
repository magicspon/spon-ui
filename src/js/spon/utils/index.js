export const createStore = () => {
	const store = {}

	return {
		add(key, value) {
			store[key] = value
		},

		set(key, value) {
			const item = store[key]
			store[key] = {
				...item,
				...value
			}
		},

		get(key) {
			return store[key]
		},

		has(key) {
			return !!store[key]
		},

		delete(key) {
			delete store[key]
		},

		get store() {
			return store
		}
	}
}

export function registerPlugins(cache) {
	return name => plugin => {
		const { plugins = [] } = cache.get(name)

		cache.set(name, {
			plugins: [...plugins, plugin]
		})
	}
}
