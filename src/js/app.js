import { loadApp } from '@spon/core'

loadApp(document.body, {
	fetch: name => import(`@/behaviours/${name}`)
})
