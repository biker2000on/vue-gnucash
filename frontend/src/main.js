import Vue from 'vue'
import './plugins'
import App from './App.vue'
import axios from 'axios'
import directives from "./directives/directives";
import { router } from './router/router'

import VueApollo from 'vue-apollo'
import ApolloClient from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

for (let directive in directives) {
    let definition = directives[directive];

    Vue.directive(directive, definition);
}

Vue.use(VueApollo)

 // Create an http link:
 const link = new HttpLink({
  uri: 'http://localhost:4000', //need to add to .env
  fetch,
});
const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache({
    addTypename: true
  })
});

const apolloProvider = new VueApollo({
  defaultClient: client,
})

window.axios = axios

Vue.config.productionTip = false

new Vue({
  apolloProvider,
  router,
  render: h => h(App),
}).$mount('#app')
