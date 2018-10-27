import paginationExample from '@/views/loaders/pagination'

export default [
	{
		path: '/',
		name: 'home-page',
		customBodyProp: html => {
			log('custom body prop')
		},
		options: {
			things: 10
		}
	},
	{
		path: '*',
		name: 'default',
		customBodyProp: html => {
			log('custom body prop')
		}
	}
]
