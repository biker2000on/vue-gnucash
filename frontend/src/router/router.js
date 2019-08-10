import Vue from 'vue'
import VueRouter from 'vue-router'
import Budget from '../components/Budget'
import Report from '../components/Report'
import AccountTabulator from '../components/AccountTabulator'
import AccountTreeTabulator from '../components/AccountTreeTabulator'

// charts
import ChartContainer from '../components/charts/ChartContainer'
import BarExample from '../components/charts/BarExample'
import LineExample from '../components/charts/LineExample'
import DoughnutExample from '../components/charts/DoughnutExample'
import PieExample from '../components/charts/PieExample'
import RadarExample from '../components/charts/RadarExample'
import PolarAreaExample from '../components/charts/PolarAreaExample'
import BubbleExample from '../components/charts/BubbleExample'
import ReactiveExample from '../components/charts/ReactiveExample'
import ReactivePropExample from '../components/charts/ReactivePropExample'
import ScatterExample from '../components/charts/ScatterExample'
import HorizontalBarExample from '../components/charts/HorizontalBarExample'
import CustomLine from '../components/charts/CustomExample'

Vue.use(VueRouter)

const routes = [
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
  },
  {
    path: '/report',
    component: ChartContainer, 
    props: true,
    children: [
      {
        path: 'pie',
        name: 'pie',
        component: PieExample,
        props: true,
      },
      {
        path: 'bar',
        name: 'bar',
        component: BarExample,
        props: true,
      },
      {
        path: 'line',
        name: 'line',
        component: LineExample,
        props: true,
      },
      {
        path: 'bubble',
        name: 'bubble',
        component: BubbleExample,
        props: true,
      },
      {
        path: 'doughnut',
        name: 'doughnut',
        component: DoughnutExample,
        props: true,
      },
      {
        path: 'radar',
        name: 'radar',
        component: RadarExample,
        props: true,
      },
      {
        path: 'polar-area',
        name: 'polar-area',
        component: PolarAreaExample,
        props: true,
      },
      {
        path: 'scatter',
        name: 'scatter',
        component: ScatterExample,
        props: true,
      },
      {
        path: 'horizontal-bar',
        name: 'horizontal-bar',
        component: HorizontalBarExample,
        props: true,
      },
    ]
  }
]

export const router = new VueRouter({
  routes
})


