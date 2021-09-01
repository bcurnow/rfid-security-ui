import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/axios'
import './plugins/bootstrap-vue'
import App from './App.vue'
import router from './router'
import config from './config'
import {name, version} from '../package'

config.appVersion = name + ' v' + version

Vue.config.productionTip = config.production || false

// Add the global vars for the application
Vue.prototype.$config = config

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
