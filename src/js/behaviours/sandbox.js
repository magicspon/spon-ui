/* eslint-disable no-console */

import { connect } from '@/store'
import resize from '@/plugins/resize'
import inview from '@/plugins/inview'

function sandbox({ plugins, node }) {
	const { device, inview } = plugins

	device.at('(min-width: 400px)', {
		on: () => {
			console.log('sandbox does')
		},
		off: () => {
			console.log('sandbox does not')
		}
	})

	inview.settings = { rootMargin: '0px' }

	inview.observe(node.querySelector('[data-item="terry"]'), {
		enter: () => {
			console.log('enter')
		},

		exit: () => {
			console.log('exit')
		},

		inview: () => {
			console.log('i am inview i am')
		}
	})

	return () => {}
}

export default connect({
	plugins: [resize, inview]
})(sandbox)
