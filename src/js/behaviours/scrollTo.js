import { withPlugins } from '@spon/core'
import withDomEvents from '@/plugins/withDomEvents'

function scrollTo({ plugins: { addEvents } }) {
	function onClick(e, elm) {
		e.preventDefault()
		const { href } = elm
		// something
		console.log(href)
	}

	addEvents(document, {
		'click [data-scroll-to]': onClick
	})
}

export default withPlugins(withDomEvents)(scrollTo)
