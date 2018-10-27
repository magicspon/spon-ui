import React from 'react'
import posed from 'react-pose'

const Button = posed.button({
	open: {
		x: -350,
		transition: { ease: 'easeIn' }
	},

	close: {
		x: 0,
		transition: { ease: 'easeOut' }
	}
})

export default ({ isTagsOpen, isContentOpen, onClickToggleTagsPane }) => (
	<Button
		pose={isTagsOpen || isContentOpen ? 'open' : 'close'}
		type="button"
		onClick={onClickToggleTagsPane}
		className="rounded-full bg-brand-50 flex items-center text-xs-fluid text-white mt-1 mr-1 outline-none absolute pin-t pin-r z-10"
	>
		{!isTagsOpen &&
			!isContentOpen && <span className="pl-1 mr-0-5 block">Tags</span>}
		<span
			key="circle"
			className="w-30 h-30 bg-brand rounded-full flex items-center justify-center relative block"
		>
			<svg viewBox="0 0 16.829 16.83" className="w-15 h-15 absolute pin m-auto">
				<path
					d="M7.168 16.83a.929.929 0 0 1-.655-.27L.271 10.316a.926.926 0 0 1 0-1.308L9.007.27a.927.927 0 0 1 .655-.27h6.242a.925.925 0 0 1 .925.925v6.242a.929.929 0 0 1-.27.654L7.822 16.56a.93.93 0 0 1-.654.27zM2.233 9.662l4.935 4.935 7.812-7.812V1.85h-4.935z"
					fill="#fff"
				/>
				<path
					d="M12.544 4.286a1.11 1.11 0 1 0 0 1.569 1.11 1.11 0 0 0 0-1.57"
					fill="#fff"
				/>
				<path fill="none" d="M0 0h16.829v16.83H0z" />
			</svg>
		</span>
	</Button>
)
