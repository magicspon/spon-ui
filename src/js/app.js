import '@/plugins/logger'
import WebFontLoader from '@/plugins/webfontloader'

if (module.hot) {
	module.hot.accept()
}

WebFontLoader()

// import '~/dropdown/dropdown'

// import '~/slide/slide'

// import '~/tabs/tabs'

import viewport from '@/utils/viewport'

const v = viewport()
log(v)

v.start()
v.on('resize', () => {
	log('hello')
})
