import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import config from '@/config'
import axiosPlugin from '@/plugins/axios'
import { createBootstrap } from 'bootstrap-vue-next'

// Styles
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'

const version: string = import.meta.env.VITE_PACKAGE_VERSION ?? '0'
const name: string = import.meta.env.VITE_PACKAGE_NAME ?? 'rfid-security-svc'

config.appVersion = `${name} v${version}`

const app = createApp(App)

app.use(router)
app.use(axiosPlugin)
app.use(createBootstrap())

app.mount('#app')


