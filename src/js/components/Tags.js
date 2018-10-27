import React from 'react'

export default ({ tags, onTagClick }) => (
	<>
		<h3 className="text-brand text-lg-fluid mb-2">Tags</h3>
		<ul className="list-reset">
			{tags.map(item => (
				<li className="mb-1" key={item.key}>
					<a
						href="#0"
						onClick={e => {
							e.preventDefault()
							onTagClick(item.key)
						}}
						className={`${
							item.isActive ? 'opacity-100' : 'opacity-50'
						} text-body-fluid text-brand no-underline`}
					>
						{item.key}
					</a>
				</li>
			))}
		</ul>
	</>
)
