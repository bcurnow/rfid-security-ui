import 'mutationobserver-shim'
import Vue from 'vue'
import '@/plugins'
import App from '@/App.vue'
import router from '@/router'
import config from '@/config'
import RFIDSecuritySvc from '@/components/rfidsecuritysvc'


const version = process.env.PACKAGE_VERSION || 0
const name = process.env.PACKAGE_NAME || 'rfid-security-svc'

config.appVersion = `${name} v${version}`

Vue.config.productionTip = config.production || false

// Turn off the annoying Vue extension message
Vue.config.devtools = false

// Add the global vars for the application
Vue.prototype.$config = config

// Add the global vars for the services
Vue.prototype.$RFIDSecuritySvc = RFIDSecuritySvc

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
