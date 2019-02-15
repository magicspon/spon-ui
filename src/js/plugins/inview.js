export default function inview({ register, node }) {
	let observer

	const defaults = {
		rootMargin: '0px',
		threshold: 0
	}

	register(() => {
		if (observer) {
			observer.disconnect()
		}
	})

	return {
		inview: {
			settings: {},

			observe(...args) {
				const target = args.length > 1 ? args[0] : node
				const fn = args.length > 1 ? args[1] : args[0]

				const { enter, exit, inview } = fn

				observer = new IntersectionObserver(
					(entries, observer) => {
						entries.forEach(entry => {
							if (inview) {
								inview()
							}

							if (entry.isIntersecting) {
								enter(entry, observer)
							} else {
								exit(entry, observer)
							}
						})
					},
					{
						...defaults,
						...this.settings
					}
				)

				observer.observe(target)
			},

			disconnect: () => {
				observer.disconnect()
			}
		}
	}
}
