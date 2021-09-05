import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/axios'
import './plugins/bootstrap-vue'
import App from './App.vue'
import router from './router'
import config from './config'
import {name, version} from '../package'
import RFIDSecuritySvc from './components/RFIDSecuritySvc.js'
import store from './store'


config.appVersion = name + ' v' + version

Vue.config.productionTip = config.production || false
// Turn off the annoying Vue extension message
Vue.config.devtools = false

// Add the global vars for the application
Vue.prototype.$config = config

// Add the global vars for the services
Vue.prototype.$RFIDSecuritySvc = RFIDSecuritySvc

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
