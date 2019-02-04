import '@/plugins/logger'
import run from './core/loader'

const app = run(document)

if (module.hot) {
	module.hot.accept()
}

app.hydrate()

log(app.a)
