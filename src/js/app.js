import '@/plugins/logger'
import WebFontLoader from '@/plugins/webfontloader'

if (module.hot) {
	module.hot.accept()
}

WebFontLoader()

// import '~/dropdown/dropdown'

import '~/navigation/FancyNav'

// import '~/tabs/tabs'

import viewport from 'spon-resize'
