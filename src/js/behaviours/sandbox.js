import { withRefs, withDomEvents, withPlugins } from '@spon/core'
import inview from '@/plugins/inview'
import device from '@/plugins/device'

function sandbox({ node, plugins: { inview, device } }) {
	inview.observe(node, {
		enter() {
			console.log('enter')
		},
		exit() {
			console.log('exit')
		}
	})

	device.resize(() => {
		console.log('helo')
	})
}

// and any custom plugins
export default withPlugins(withRefs, withDomEvents, inview, device)(sandbox)
