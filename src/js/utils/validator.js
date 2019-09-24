// @ts-check
import validate from 'validate.js'
import { eventBus } from '@spon/plugins'
import domEvents from '@spon/domevents'
import debounce from '@/utils/debounce'

/**
 * @module utils/validator
 */

/**
 * @property {HTMLElement} props.form
 * @property {Object} props.rules
 * @property {String} props.namespace
 * @return {validatorType}
 */

/**
 * @typedef {Object} validatorType
 * @property {function} validator.destroy - destroy the validator, remove events
 * @property {function} validator.on - listen to events
 * @property {function} validator.off - remove event listeners
 * @property {boolean} validator.isSubmitting - set the isSubmitting state
 */

function validator({ form, rules = {}, namespace }) {
	const { addEvents, removeEvents } = domEvents(form)
	const onHandles = []

	validate.validators.checked = function(value, options) {
		if (value !== true) return options.message || 'must be checked'
	}

	let isSubmitting = false

	const required = [...form.querySelectorAll('[required]')].reduce(
		(acc, field) => {
			const { name, type } = field
			const rule = rules[name]
				? rules[name]
				: { presence: true, email: type === 'email' }

			return {
				...acc,
				[name]: { field, type, rule, name, touched: false, error: false }
			}
		},
		{}
	)

	const getRules = Object.entries(required).reduce((acc, [key, value]) => {
		const { rule } = value
		return { ...acc, [key]: rule }
	}, {})

	/**
	 * @function onSubmit
	 * @memberof validator
	 * @param {Event} e the event object
	 * @return {void}
	 */
	function onSubmit(e) {
		e.preventDefault()

		if (isSubmitting) {
			return
		}

		// @ts-ignore
		const fails = validate(e.target, getRules)

		if (!fails) {
			isSubmitting = true
			eventBus.emit(`@${namespace}:submit/valid`, e)
			return
		}

		const errors = Object.entries(fails).map(([key, error]) => {
			const item = { ...required[key], error }

			eventBus.emit(`@${namespace}:input/error`, item)

			return item
		})
		isSubmitting = false
		eventBus.emit(`@${namespace}:submit/error`, errors)
	}

	/**
	 * @function onBlur
	 * @memberof validator
	 * @param {Event} e the event object
	 * @return {void}
	 */
	function onBlur(e) {
		// @ts-ignore
		const { value, name } = e.target
		const touched = value.length > 0

		// we only want to start validating
		// once the user has actually interacted
		// with the form.
		if (!touched) return

		// length check used because validate.js doesn't check empty strings
		// see important notice https://validatejs.org/#overview
		const failed =
			validate.single(value, required[name].rule) || value.length < 1

		// no errors... emit and return
		if (!failed) {
			Object.assign(required, {
				[name]: {
					...required[name],
					touched,
					error: null
				}
			})
			eventBus.emit(`@${namespace}:input/valid`, required[name])
			return
		}

		// create a fallback message
		// this will only be used if the value.length < 1
		const message = failed === true ? ['DEFAULT_MISSING_MESSAGE'] : failed

		Object.assign(required, {
			[name]: {
				...required[name],
				touched,
				error: message
			}
		})

		eventBus.emit(`@${namespace}:input/error`, {
			...required[name],
			error: message
		})
	}

	addEvents({
		submit: onSubmit,
		'keyup [required]': [debounce(onBlur, 500), true],
		'blur [required]': [onBlur, true]
	})

	form.setAttribute('novalidate', true)

	return {
		destroy() {
			removeEvents()
			onHandles.forEach(([event, fn]) => {
				eventBus.off(`@${namespace}:${event}`, fn)
			})

			form.removeAttribute('novalidate')
		},

		on(event, fn) {
			eventBus.on(`@${namespace}:${event}`, fn)
			onHandles.push([event, fn])
		},

		off(event, fn) {
			eventBus.off(`@${namespace}:${event}`, fn)
		},

		set isSubmitting(value) {
			isSubmitting = value
		}
	}
}

export default validator
