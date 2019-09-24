module.exports = {
	status: 'test',

	context: {
		title: 'Page 1',
		className: 'pin-t pin-l',
		className2: 'pin m-auto',
		style: 'width: 500px; transition: all 300ms ease; height: 100px;',
		color: 'blue-300',
		behaviour: 'a'
	},

	variants: [
		{
			name: '2',
			context: {
				title: 'Page 2',
				className: 'pin-t pin-r',
				style:
					'width: 500px; transition: all 300ms ease; height: 100px; right: 0; top: 0;',
				color: 'red-400',
				behaviour: 'b'
			}
		},
		{
			name: '3',
			context: {
				title: 'Page 3',
				className: 'pin-b pin-l',
				style:
					'width: 500px; transition: all 300ms ease; height: 100px; right: 0; bottom: 0;',
				color: 'green-600',
				behaviour: 'c'
			}
		},
		{
			name: '4',
			context: {
				title: 'Page 4',
				className: 'pin-b pin-r',
				style:
					'width: 500px; transition: all 300ms ease; height: 100px; left: 0; bottom: 0;',
				color: 'yellow-200',
				behaviour: 'd'
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
