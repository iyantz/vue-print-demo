import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 引入hiprint并取消自动连接
import { hiprint, disAutoConnect } from 'vue-plugin-hiprint'

// 取消自动连接以避免 WebSocket 错误
disAutoConnect()

const app = createApp(App)

// 注册Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(ElementPlus)

app.mount('#app') 