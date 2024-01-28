import './assets/base.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VeeValidatePlugin from '@/includes/validation'
import { configAxios } from './api/axios'

import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(VeeValidatePlugin)
app.use(pinia)

configAxios()

app.mount('#app')
