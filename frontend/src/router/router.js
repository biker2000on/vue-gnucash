import Vue from 'vue'
import VueRouter from 'vue-router'
import Budget from '../components/Budget'
import AccountTabulator from '../components/AccountTabulator'
import AccountTreeTabulator from '../components/AccountTreeTabulator'

Vue.use(VueRouter)

const routes = [
  // { path: '/foo', component: Foo },
  // { path: '/bar', component: Bar }
  {
    path: '/budget/:budget_guid',
    name: 'budget',
    component: Budget,
    props: true,
  },
  {
    path: '/account/:account_guid',
    name: 'account',
    component: AccountTabulator,
    props: true,
  },
  {
    path: '/',
    name: 'accountTree',
    component: AccountTreeTabulator,
    props: true,
    alias: '/accounts'
  }
]

export const router = new VueRouter({
  routes
})


