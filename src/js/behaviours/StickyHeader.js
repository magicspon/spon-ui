import Behaviour from '@/core/Behaviour'
import Headroom from 'headroom.js'

export default class StickyHeader extends Behaviour {
	mount = () => {
		this.headroom = new Headroom(this.$el)

		this.headroom.init()
	}
}
