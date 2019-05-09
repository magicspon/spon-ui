import throttle from 'raf-throttle'


export default function setVhCssVar() {
	const vh = window.innerHeight * 0.01
	// Then we set the value in the --vh custom property to the root of the document
	document.documentElement.style.setProperty('--vh', `${vh}px`)
	const handle = throttle(() => {
		const vh = window.innerHeight * 0.01
		document.documentElement.style.setProperty('--vh', `${vh}px`)
	})


	window.addEventListener(
		'resize',handle
	)

	return () => {
		window.addEventListener('resize', handle)
	}
}
