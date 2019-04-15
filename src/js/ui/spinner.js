// @ts-check
import domify from 'domify'

const svg =
	'<svg class="o-spinner" width="40px" height="40px" viewBox="0 0 40 40"><circle class="o-spinner__path" fill="none" stroke-width="6" stroke-linecap="round" cx="20" cy="20" r="15"></circle></svg>'

/**
 * * @module ui/spinner
 */

/**
 * @function spinner
 * @param {HTMLElement} target
 * @return {spinnerType}
 */

/**
 * @typedef {Object} spinnerType
 * @property {function} spinner.add - inject the spinner
 * @property {function} spinner.remove - remove the spinner
 */

function spinner(target) {
	const node = domify(svg, document)

	return {
		add() {
			target.appendChild(node)
			return node
		},

		remove() {
			target.removeChild(node)
		}
	}
}

export default spinner
