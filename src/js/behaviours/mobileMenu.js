// @ts-check
import toggle from '@/ui/toggle'

/**
 * @module behaviour/mobileMenu
 */

function mobileMenu({ node }) {
	const nav = toggle({
		button: node,
		name: 'mobile-menu',
		activeClass: 'is-active'
	})

	nav.init()

	nav.on('open:mobile-menu', ({ target }) => {
		target.classList.add('is-open')
	})

	nav.on('close:mobile-menu', ({ target }) => {
		target.classList.remove('is-open')
	})

	return () => {
		nav.destroy()
	}
}

export default mobileMenu
