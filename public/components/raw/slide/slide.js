import SponSlide from 'spon-slide'
const node = document.querySelector('[data-ui="slide"]')

if (node) {
	[...document.querySelectorAll('[data-ui="slide"]')].forEach(item => {
		const slide = new SponSlide(item, {
			wrap: true
		})

		slide.init()
	})
}
