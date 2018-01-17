import SponSlide from 'spon-slide'
const node = document.querySelector('[data-ui="slide"]')

if (node) {
	const slide = new SponSlide(document.querySelector('[data-ui="slide"]'))

	slide.init()
}
