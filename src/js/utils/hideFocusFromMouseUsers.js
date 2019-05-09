export default function hideFocusFromMouseUsers() {
	function handleFirstTab(e) {
		if (e.keyCode === 9) {
			document.documentElement.classList.add('user-is-tabbing')

			window.removeEventListener('keydown', handleFirstTab)
			window.addEventListener('mousedown', handleMouseDownOnce) // eslint-disable-line no-use-before-define
		}
	}

	function handleMouseDownOnce() {
		document.documentElement.classList.remove('user-is-tabbing')

		window.removeEventListener('mousedown', handleMouseDownOnce)
		window.addEventListener('keydown', handleFirstTab)
	}

	window.addEventListener('keydown', handleFirstTab)

	return () => {
		window.removeEventListener('keydown', handleFirstTab)
	}
}
