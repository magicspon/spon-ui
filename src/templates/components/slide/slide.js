import SponSlide from '@/ui/SponSlide'
const node = document.querySelector('[data-ui="slide"]')

if (node) {
	const slide = new SponSlide(document.querySelector('[data-ui="slide"]'))

	slide.init()
}
