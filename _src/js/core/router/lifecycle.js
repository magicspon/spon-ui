import domify from 'domify'
import { findRoute } from './utils/paths'
import { setTransitionAttributes } from './utils/dom'
import baseTransition from './transition'
import request from './request'
import historyManager from './history'
import eventBus from '@/core/modules/eventBus'
import * as Action from './actions'

export default class Lifecycle {
	constructor({ routes, rootNode }) {
		this.matchRoute = findRoute(routes)

		historyManager.set('from', this.matchRoute(window.location.href))
		this.wrapper = rootNode
	}

	onLoad = pathname => {
		// get the new route object
		const state = this.matchRoute(pathname)

		// combine the transition methods
		const view = { ...baseTransition, ...state.view }

		// all the onLoad method
		view.onLoad(state)

		// emit this bad boy
		eventBus.emit(Action.ROUTE_TRANSITION_LOAD, state)

		setTransitionAttributes.lifecycle('on-load')
	}

	init = async ({ pathname, action, transition: trans, dataAttrs }) => {
		// get the new route object

		const newState = this.matchRoute(pathname)
		// have we been supplied with a transition object... no.. use the route one <--- transition prop needs testing

		const view = trans || newState.view
		// update the from history store.... <REWITE></REWITE>
		// historyManager.store.to = newState
		historyManager.set('to', newState)

		const from = historyManager.get('from')
		const to = historyManager.get('to')

		// combine the transition methods for exit... basic + route exits
		this.exitTransition = Object.assign({}, baseTransition, from.view)

		// combine the transition methods for exit... basic + route enters
		this.enterTransition = Object.assign({}, baseTransition, view)

		// setup the props to be passed to onExit and onExitComplete
		const exitProps = {
			to,
			from,
			wrapper: this.wrapper,
			oldHtml: document.querySelector(this.exitTransition.el),
			action,
			dataAttrs
		}

		const [markup] = await Promise.all([
			request(pathname),
			this.onExit(exitProps)
		])

		eventBus.emit(Action.ROUTE_TRANSITION_RESOLVED, exitProps)

		if (from.name) {
			setTransitionAttributes.from(from.name)
		}
		if (to.name) {
			setTransitionAttributes.to(to.name)
		}
		setTransitionAttributes.lifecycle('on-exit')

		const html = domify(markup)
		const title = html.querySelector('title').textContent.trim()
		// query the new newHtml for the selector defined on
		// this object... default = '.page-child'
		const newHtml = html.querySelector(this.enterTransition.el)
		const enterProps = {
			...exitProps,
			newHtml,
			title,
			html
		}

		// check... do we want to unmount the previous html
		const shouldUnmount = this.enterTransition.shouldUnmount(enterProps)
		const shouldMount = this.enterTransition.shouldMount(enterProps)

		// if we do... sure... unmount event
		if (shouldUnmount)
			eventBus.emit(Action.ROUTE_TRANSITION_BEFORE_DOM_UPDATE, exitProps)

		// no proms here.. just call this method
		this.exitTransition.onAfterExit(exitProps)
		// update the dom method

		this.enterTransition.updateDom(enterProps)

		if (to.customBodyProp) {
			const prop = to.customBodyProp(newHtml)
			setTransitionAttributes.toggleCustomBodyProp(prop)
		} else {
			setTransitionAttributes.toggleCustomBodyProp(false)
		}

		// emit update event
		if (shouldMount)
			eventBus.emit(Action.ROUTE_TRANSITION_AFTER_DOM_UPDATE, enterProps)

		setTransitionAttributes.lifecycle('on-after-exit')

		await this.onEnter(enterProps)

		this.enterTransition.onAfterEnter(enterProps)
		setTransitionAttributes.lifecycle('done')

		historyManager.set('from', newState)
		eventBus.emit(Action.ROUTE_TRANSITION_COMPLETE, enterProps)

		return enterProps
	}

	onExit = async props => {
		await new Promise((resolve, reject) => {
			this.exitTransition.onExit({
				...props,
				next: resolve,
				onError: reject
			})
		})
	}

	onEnter = async props => {
		await new Promise((resolve, reject) => {
			this.enterTransition.onEnter({
				...props,
				next: resolve,
				onError: reject
			})
		})
	}
}
