import Behaviour from '@/core/Behaviour'
import VanillaModal from 'vanilla-modal'
import scrollLock from 'scroll-locker'

/** *
 * @class Modal
 * @extends Behaviour
 * @desc Handles the hero carousels - via vanilla-modal
 *
 * @example /04-components/modal
 *
 * @return {Behaviour}
 */
export default class Modal extends Behaviour {
	mount() {
		const scroll = scrollLock(document.body)

		this.modal = new VanillaModal({
			modal: '.c-modal',
			modalInner: '.c-modal__inner',
			modalContent: '.c-modal__content',
			open: '[data-modal-open]',
			close: '[data-modal-close]',
			page: 'body',
			loadClass: 'vanilla-modal',
			class: 'modal-visible',
			clickOutside: true,
			closeKeys: [27],
			transitions: true,
			onOpen() {
				scroll.lock()
			},

			onClose() {
				scroll.unlock()
			}
		})
	}
}
