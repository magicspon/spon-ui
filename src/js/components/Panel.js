import React, { Component } from 'react'
import posed, { PoseGroup } from 'react-pose'

const Box = posed.div({
	enter: {
		x: '0%',
		transition: { ease: 'easeIn' }
	},
	exit: {
		x: '100%'
	}
})

export default class Panel extends Component {
	render() {
		const { children, isOpen, closeHandle } = this.props

		return (
			<PoseGroup>
				{isOpen && (
					<Box
						key="pane"
						className="absolute pin-t pin-r h-full z-10 flex items-start"
					>
						<div className="max-w-full w-screen md:w-350 bg-white h-full p-1">
							{children}
							<button
								type="button"
								className="absolute pin-t pin-r mt-0-5 mr-0-5"
								onClick={closeHandle}
							>
								<svg className="w-15 h-15 fill-current" viewBox="0 0 15 15">
									<path d="M14.097 15.096a.997.997 0 0 1-.707-.293L.293 1.707A1 1 0 0 1 1.707.293L14.804 13.39a1 1 0 0 1-.707 1.707z" />
									<path d="M1 15.096a1 1 0 0 1-.707-1.707L13.39.293a1 1 0 1 1 1.414 1.414L1.707 14.803a.997.997 0 0 1-.707.293z" />
									<path fill="none" d="M0 0h15.096v15.096H0z" />
								</svg>
							</button>
						</div>
					</Box>
				)}
			</PoseGroup>
		)
	}
}
