import Vue from 'vue'

import App from './App.vue'

import router from '@/router'
import '@/permission'

import * as api from '@/api/'

import 'normalize.css/normalize.css'
import '@/styles/app.less'

// 为避免第三方资源引用或解析出错的问题，将第三方字体文件转换为本地资源
// 此处转为内嵌的 base64
import 'vant/lib/icon/local.css'

import { Button, Cell, CellGroup } from 'vant'
;[Button, Cell, CellGroup].forEach(item => Vue.use(item))

import vconsole from 'vconsole'

const consoleEnvList = ['local', 'development', 'test']

if (consoleEnvList.includes(env.name)) {
  new vconsole()
}

Vue.config.productionTip = false

Vue.prototype.$api = api

new Vue({
  el: '#app',
  router,
  render: h => h(App),
})
