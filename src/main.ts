import { createPinia } from 'pinia'

import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import './style.css'

const app = createApp(App)

const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')

// Set window title with TEST suffix in dev mode
if (import.meta.env.DEV) {
    document.title = 'bytEvidence TEST'
}
