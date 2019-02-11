export default function testFunk(props) {
	const { node } = props

	// log('testFunk load')

	node.classList.add('loaded')

	return () => {
		// log('testFunk killed')
	}
}
