/* eslint-disable no-console */

import { connect } from '@/store'
import resize from '@/plugins/resize'

function demo({ plugins }) {
	const { device } = plugins

	device
		.at('(min-width: 300px)', {
			on: () => {
				console.log('demo does')
			},
			off: () => {
				console.log('demo does not')
			}
		})
		.at('(min-width: 700px)', {
			on: () => {
				console.log('demo wayne')
			},
			off: () => {
				console.log('demo wayne not')
			}
		})

	return () => {}
}

export default connect({
	plugins: [resize]
})(demo)
