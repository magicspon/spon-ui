module.exports = {
	status: 'test',

	context: {
		title: 'Page 1',
		className: 'pin-t pin-l',
		className2: 'pin m-auto',
		style: 'width: 500px; height: 300px;',
		color: 'blue-dark'
	},

	variants: [
		{
			name: '2',
			context: {
				title: 'Page 2',
				className: 'pin-t pin-r',
				style: 'width: 500px; height: 300px; left: 200px; top: 300px;',
				color: 'red-dark'
			}
		},
		{
			name: '3',
			context: {
				title: 'Page 3',
				className: 'pin-b pin-l',
				style: 'width: 500px; height: 300px; left: 500px; top: 200px;',
				color: 'green-dark'
			}
		},
		{
			name: '4',
			context: {
				title: 'Page 4',
				className: 'pin-b pin-r',
				style: 'width: 500px; height: 300px; left: 60px; top: 600px;',
				color: 'yellow-dark'
			}
		}
	]
}

/*

sample context

{
	heading: 'This is a heading',

	body: '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptas optio illo est necessitatibus ex explicabo!</p>',

	image: {
		src: '/dist/img/face.jpg',
		alt: 'Picture of a face',
		width: '',
		height: ''
	},

	link: {
		href: '#0',
		text: 'Read more'
	},

}
*/
