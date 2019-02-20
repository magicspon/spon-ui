export { default as domEvents, withDomEvents } from './modules/domEvents'
export { default as eventBus } from './modules/eventBus'
export { default as refs, withRefs, createNode } from './modules/refs'
export { default as router } from './modules/router'
export { default as loadApp, cache } from './app'

import { registerPlugin } from './app'
import bindPlugins from './modules/withPlugins'

export const withPlugins = bindPlugins(registerPlugin)

import connect from './modules/connect'

export const connectStore = connect(registerPlugin)
