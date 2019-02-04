import url from 'url-parse'

export default () => {
	const initialHref = window.location.href
	const params = url(initialHref)

	return {
		state: {
			prev: {},
			current: {
				params,
				html: document.body
			},
			cache: {}
		},
		reducers: {
			setPage: (state, payload) => {
				const { current, cache } = state

				return {
					...state,
					prev: current,
					current: payload,
					cache: {
						...cache,
						[payload.params.href]: payload
					}
				}
			}
		},
		effects: dispatch => ({
			async fetchPage(params, { router: currentState }) {
				const { href } = params
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
