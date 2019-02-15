/* eslint-disable no-console */

import { connect } from '@/store'
import resize from '@/plugins/resize'

function sandbox({ plugins }) {
	const { device } = plugins

	device.at('(min-width: 400px)', {
		on: () => {
			console.log('sandbox does')
		},
		off: () => {
			console.log('sandbox does not')
		}
	})

	return () => {}
}

export default connect({
	plugins: [resize]
})(sandbox)
