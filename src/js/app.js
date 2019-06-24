/* eslint-disable no-console */

import { loadApp } from '@spon/core'
import barba from '@barba/core'

const app = loadApp(document.body, {
	fetch: name => import(`@/behaviours/${name}`)
})

// crude!
let box
let newBox

barba.init({
	transitions: [
		{
			beforeLeave({ current, next }) {
				box = current.container
					.querySelector('[data-behaviour="counter"]')
					.getBoundingClientRect()
				// const box2 = next.container
				// 	.querySelector('[data-behaviour="counter"]')
				// 	.getBoundingClientRect()

				console.log(box)
				// console.log(box2)
			},
			beforeEnter({ next }) {
				const item = next.container.querySelector('[data-behaviour="counter"]')
				newBox = item.getBoundingClientRect()

				Object.assign(item.style, {
					top: `${box.top}px`,
					right: `${box.right}px`,
					bottom: `${box.bottom}px`,
					left: `${box.left}px`
				})
			},
			afterEnter({ next }) {
				console.log('enter')
				const item = next.container.querySelector('[data-behaviour="counter"]')

				Object.assign(item.style, {
					top: `${newBox.top - next.container.clientHeight}px`,
					right: `${newBox.right}px`,
					bottom: `${newBox.bottom - next.container.clientHeight}px`,
					left: `${newBox.left}px`
				})
			}
		}
	]
})

barba.hooks.after(({ next }) => {
	app.hydrate(next.container)
})

barba.hooks.leave(() => {
	app.destroy()
})
