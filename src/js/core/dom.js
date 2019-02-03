/* eslint-disable no-unused-expressions */

import hyperHTML from 'hyperhtml'
const { bind } = hyperHTML

const h = (node, items, template) => {
	bind(node)`${items.map(template)}`
}

export default h
