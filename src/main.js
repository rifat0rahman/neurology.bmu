import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import api from './utils/api'
import {Notify} from './utils/notify'

const app = createApp(App)

app.config.globalProperties.$api = api
app.config.globalProperties.$notify = Notify

app.use(router)

app.mount('#app')
