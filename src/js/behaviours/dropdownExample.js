// @ts-check
import dropdown from '@/ui/dropdown'
/**
 * @module behaviour/userMenu
 */
/**
 *
 * @function dropdownExample
 * @description This behaviour handles the user menu drop down, it uses the dropdown ui component
 * @example
 * <div data-behaviour="userMenu">
 *   <a href="#user-menu" data-dropdown-button>button</a>
 *   <div id="user-menu" data-dropdown-menu>...</div>
 * </div>
 * @param {Object} props
 * @property {HTMLELement} props.node
 * @return {Function}
 */
function dropdownExample({ node }) {
	const dd = dropdown({ node, name: 'example/dropdown' })

	dd.init()

	dd.on(`example/dropdown:click`, ({ e, elm }) => {
		e.preventDefault()
	})

	return () => {
		dd.destroy()
	}
}

export default dropdownExample
