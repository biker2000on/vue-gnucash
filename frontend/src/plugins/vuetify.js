import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'
import colors from 'vuetify/es5/util/colors'
import VueTabulator from 'vue-tabulator'

Vue.use(Vuetify, {
  iconfont: 'md',
  theme: {
    primary: colors.green,
    secondary: colors.green.lighten3,
    accent: colors.green.accent2,
  }
})
Vue.use(VueTabulator)