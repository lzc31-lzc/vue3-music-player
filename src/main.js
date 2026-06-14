import { createApp } from 'vue'
import App from './App.vue'
import './mock'
import router from './router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { useThemeStore } from './store/Theme'
import Vant from 'vant'
import 'vant/lib/index.css'
import './style.css'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(Vant)

const theme = useThemeStore()
theme.initTheme()

app.mount('#app')