// @ts-check
import Headroom from 'headroom.js'

function stickyHeader({ node }) {
	const headroom = new Headroom(node)

	headroom.init()
}

export default stickyHeader
