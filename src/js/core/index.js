import { loadApp, connect as bindConnect, registerPlugin } from '@/spon'
import store from '@/store'

export const connect = bindConnect(store, registerPlugin)

export default loadApp
