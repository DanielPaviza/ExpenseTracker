import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n';

import App from './App.vue'
import router from './router'
import './style.css'

import cs from './locales/cs.json';
import en from './locales/en.json';

const i18n = createI18n({
    locale: 'cs',
    fallbackLocale: 'en',
    messages: {
        cs,
        en,
    },
});

const app = createApp(App)
app.use(i18n);
app.use(router)

const pinia = createPinia()
app.use(pinia)

app.mount('#app')

// Set window title with TEST suffix in dev mode
if (import.meta.env.DEV) {
    document.title = 'bytEvidence TEST'
}
