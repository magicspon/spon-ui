import { hooks } from '@barba/core'

const leave = new Set()

hooks.leave(async data => {
	await Promise.all([...leave].map(item => item(data)))
})

/**
 * @function withBarba
 * @property {object} props
 * @property {HTMLElement} props.node the root node to attach events to
 * @property {function} props.register a function used to store the destroy method
 * @return {object}
 */
export default function withBarba({ register, node }) {
	let transition
	let observer
	register(() => {
		if (transition) leave.delete(transition)
		observer.disconnect()
	})

	return {
		unmount(fn) {
			observer = new IntersectionObserver(
				entries => {
					const [{ isIntersecting }] = entries
					if (isIntersecting) {
						transition = fn
						leave.add(transition)
					}
				},
				{
					threshold: 0.1
				}
			)
			observer.observe(node)
		}
	}
}
