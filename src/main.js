import './assets/main.css'

import {
  createApp
} from 'vue'
import {
  createPinia
} from 'pinia'

import App from './App.vue'
import router from './router'
import webComponents from './plugins/webComponentsJS/index.js'
import {
  MyTest as MyTestZzf
} from './components/index.js'

// 引入 Element Plus 和中文语言包
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

// 引入 ECharts 库
import * as echarts from 'echarts'
window.echarts = echarts;

const app = createApp(App)

// isCustomElement 配置
// app.config.compilerOptions.isCustomElement = (tag) => {
//   return tag.startsWith('zzf-')
// }

app.use(createPinia())
app.use(router)
app.use(ElementPlus, {
  locale: zhCn
})
app.use(webComponents)
app.use(MyTestZzf)

app.mount('#app')