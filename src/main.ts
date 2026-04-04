import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import config from '@/config'
import RFIDSecuritySvc from '@/components/rfidsecuritysvc'
import axiosPlugin from '@/plugins/axios'
import type { Config } from '@/config'
import type { RFIDSecuritySvcType } from '@/components/rfidsecuritysvc'
import { createBootstrap } from 'bootstrap-vue-next/plugins/createBootstrap'

//Icons
import 'bootstrap-icons/font/bootstrap-icons.css'

// Styles
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'

// Augment Vue's globalProperties for full TypeScript support
declare module 'vue' {
  interface ComponentCustomProperties {
    $config: Config
    $RFIDSecuritySvc: RFIDSecuritySvcType
  }
}

const version: string = import.meta.env.VITE_PACKAGE_VERSION ?? '0'
const name: string = import.meta.env.VITE_PACKAGE_NAME ?? 'rfid-security-svc'

config.appVersion = `${name} v${version}`

const app = createApp(App)

app.use(router)
app.use(axiosPlugin)
app.use(createBootstrap())
app.config.globalProperties.$config = config
app.config.globalProperties.$RFIDSecuritySvc = RFIDSecuritySvc
// app.config.devtools = false

app.mount('#app')


