import domEvents from '@spon/domevents'
/**
 * @module plugin/withDomEvents
 */

/**
 * @function withDomEvents
 * @property {object} props
 * @property {HTMLElement} props.node the root node to attach events to
 * @property {function} props.register a function used to store the destroy method
 * @return {object}
 */
export default function withDomEvents({ node, register }) {
	const events = domEvents(node)
	register(events.removeEvents)
	return events
}
