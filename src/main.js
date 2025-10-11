import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './style.css'
import './styles/components.css'
import 'highlight.js/styles/github.css'
import { useTheme } from './composables/useTheme'
// 触发 MessageFormatUtil 顶层的 showdown 初始化
import { initMessageFormatUtil } from './utils/MessageFormatUtil'

const app = createApp(App)

// 初始化主题
const { initTheme } = useTheme()
initTheme()
initMessageFormatUtil()

app.use(createPinia())
app.use(router)

app.mount('#app')
