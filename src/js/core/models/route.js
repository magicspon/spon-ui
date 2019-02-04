import url from 'url-parse'

const getKey = context => {
	const target = context.querySelector('[data-route]')
	if (!target) return false

	const { route: transitionName } = target.dataset
	const key = transitionName.length > 0 ? transitionName : false
	return key
}

export default () => {
	const initialHref = window.location.href
	const params = url(initialHref)

	return {
		state: {
			params,
			html: null,
			key: getKey(document.body),
			cache: {},
			prevUrl: window.location.href
		},
		reducers: {
			setPage: (state, payload) => {
				const { cache, params } = state

				return {
					...state,
					...payload,
					prevUrl: params.href,
					cache: {
						...cache,
						[payload.params.href]: payload
					}
				}
			}
		},
		effects: dispatch => ({
			async fetchPage(params, { router: currentState }) {
				const { href, key } = params
				const cached = currentState.cache[href]

				if (cached) {
					dispatch({
						type: 'router/setPage',
						payload: cached
					})
					await Promise.resolve()
					return
				}

				const resp = await fetch(href).then(resp => resp.text())
				const data = {
					html: resp,
					key,
					params
				}
				dispatch({
					type: 'router/setPage',
					payload: data
				})
			}
		})
	}
}