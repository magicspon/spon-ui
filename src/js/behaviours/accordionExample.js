// @ts-check
import accordion from '@/ui/accordion'
/**
 * @module behaviour/accordionExample
 */
/**
 *
 * @function accordionExample
 * @description This behaviour uses the accordion ui component
 * @param {Object} props
 * @property {HTMLELement} props.node
 * @return {Function}
 */
function accordionExample({ node, name }) {
	// create a new accordion
	const expand = accordion({ node, closeOthers: true, name })
	// initalize it
	expand.init()

	// expand.on('close', props => {
	// 	console.log(props)
	// })

	// when this module is unmounted...
	return () => {
		expand.destroy()
	}
}
export default accordionExample
