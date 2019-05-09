// @ts-check
import toggle from '@/ui/toggle'

/**
 * @module behaviour/mobileMenu
 */

function mobileMenu({ node, name }) {
	const nav = toggle({
		button: node,
		name,
		activeClass: 'is-active'
	})

	nav.init()

	nav.on(`open:${name}`, ({ target }) => {
		target.classList.add('is-open')
	})

	nav.on(`close:${name}`, ({ target }) => {
		target.classList.remove('is-open')
	})

	return () => {
		nav.close()
		nav.destroy()
	}
}

export default mobileMenu
