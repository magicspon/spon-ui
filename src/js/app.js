import '@/plugins/logger'
import WebFontLoader from '@/plugins/webfontloader'

if (module.hot) {
	module.hot.accept()
}

WebFontLoader()

import '~/dropdown/dropdown'
