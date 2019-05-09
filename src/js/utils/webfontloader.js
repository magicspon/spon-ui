import FontFaceObserver from 'fontfaceobserver'

export default () => {
	const html = document.documentElement
	const font = new FontFaceObserver('Kessel 105')

	Promise.all([font.load()])
		.then(() => html.classList.add('fonts-loaded'))
		.catch(e => {
			console.error(e) // eslint-disable-line no-console
			html.classList.add('fonts-failed')
		})
}
