import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import '../../semantic/dist/semantic.min.css'

// use
Vue.use(mavonEditor)
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
window.total_vue = new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
