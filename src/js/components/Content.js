import React from 'react'

export default ({ tags, image, title, body, onTagClick, href }) => (
	<>
		<ul className="list-reset flex items-center mb-1">
			{tags.map((item, index) => (
				<li key={item} className="text-xxs-fluid flex items-center">
					<a
						href="#0"
						className="flex items-center text-pink no-underline"
						onClick={e => {
							e.preventDefault()
							onTagClick(item)
						}}
					>
						{item}

						{index < tags.length - 1 && (
							<span className="h-10 block w-px bg-pink mx-0-25" />
						)}
					</a>
				</li>
			))}
		</ul>
		<img className="mb-0-5" src={image.src} alt={image.alt} />
		<h3 className="text-md-fluid text-brand font-bold mb-0-5">{title}</h3>
		<div
			className="text-grey text-sm-fluid mb-1"
			dangerouslySetInnerHTML={{ __html: body }}
		/>
		<a href={href} className="w-30 inline-flex">
			<svg
				viewBox="0 0 33.53 17.385"
				className="w-full h-20 fill-current text-brand"
			>
				<path d="M24.838 17.385a1 1 0 0 1-.707-1.707l6.985-6.985-6.985-6.986A1 1 0 1 1 25.545.293l7.692 7.693a1 1 0 0 1 0 1.414l-7.692 7.692a.997.997 0 0 1-.707.293z" />
				<path d="M32.082 9.693H1a1 1 0 0 1 0-2h31.082a1 1 0 0 1 0 2z" />
				<path fill="none" d="M0 0h33.53v17.385H0z" />
			</svg>
			<span className="visuallyhidden">Read more</span>
		</a>
	</>
)
