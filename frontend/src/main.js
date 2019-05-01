import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import axios from 'axios'

window.axios = axios

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
