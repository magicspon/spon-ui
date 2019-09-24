export const expander = {
	init: ({ target, button, id }) => {
		target.setAttribute('tabindex', '-1')
		target.setAttribute('aria-hidden', 'true')
		target.setAttribute('role', 'dialog')
		button.setAttribute('aria-controls', id)
		button.setAttribute('aria-expanded', 'false')
	},

	open: ({ button, target }) => {
		button.setAttribute('aria-expanded', 'true')
		target.setAttribute('aria-hidden', 'false')
	},

	close: ({ button, target }) => {
		button.setAttribute('aria-expanded', 'false')
		target.setAttribute('aria-hidden', 'true')
	},

	reset: ({ button, target }) => {
		target.removeAttribute('tabindex')
		target.removeAttribute('aria-hidden')
		target.removeAttribute('role')
		target.removeAttribute('style')

		button.removeAttribute('aria-controls')
		button.removeAttribute('aria-expanded')
	}
}
