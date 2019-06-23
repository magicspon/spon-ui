import { domEvents, withPlugins } from '@spon/plugins'

function scrollTo({ plugins: { addEvents } }) {
	function onClick(e, elm) {
		e.preventDefault()
		const { href } = elm
	}

	addEvents(document, {
		'click [data-scroll-to]': onClick
	})
}

export default withPlugins(domEvents)(scrollTo)
