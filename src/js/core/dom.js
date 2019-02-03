/* eslint-disable no-unused-expressions */

import hyperHTML from 'hyperhtml'
const { bind } = hyperHTML

const h = (template, node) => {
	bind(node)`${template}`
}

export default h
