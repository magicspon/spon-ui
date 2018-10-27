import FontFaceObserver from 'fontfaceobserver'

export default () => {
	const $html = document.getElementsByTagName('html')[0]
	const bold = new FontFaceObserver('sofiapro-bold')
	const regular = new FontFaceObserver('sofiapro-regular')
	const light = new FontFaceObserver('sofiapro-light')

	Promise.all([bold.load(), regular.load(), light.load()])
		.then(() => $html.classList.add('fonts-loaded'))
		.catch(() => $html.classList.add('fonts-failed'))
}
