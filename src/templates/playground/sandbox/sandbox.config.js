module.exports = {
	status: 'test',

	context: {
		title: 'Page 1'
	},

	variants: [
		{
			name: '2',
			context: {
				title: 'Page 2'
			}
		},
		{
			name: '3',
			context: {
				title: 'Page 3'
			}
		},
		{
			name: '4',
			context: {
				title: 'Page 4'
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
