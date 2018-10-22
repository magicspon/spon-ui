import '@/plugins/logger'
// import App from '@/core/App'
// import routes from '@/views'
import Ui from '@/core/UiLoader'

if (module.hot) {
	module.hot.accept()
}

Ui.hydrate()
