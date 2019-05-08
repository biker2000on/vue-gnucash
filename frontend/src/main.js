import Vue from 'vue'
import './plugins/vuetify'
// import './plugins/vuetiful'
import App from './App.vue'
import axios from 'axios'

import directives from "./directives/directives";

for (let directive in directives) {
    let definition = directives[directive];

    Vue.directive(directive, definition);
}

window.axios = axios

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
