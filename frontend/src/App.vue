<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <v-treeview :items="accounts" />
    </v-navigation-drawer>
    <v-toolbar fixed dark app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title class="headline text-uppercase">
        <span>Vuetify</span>
        <span class="font-weight-light">MATERIAL DESIGN</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        flat
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
      >
        <span class="mr-2">Latest Release</span>
      </v-btn>
    </v-toolbar>

    <v-content>
      <HelloWorld/>
    </v-content>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld'

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  data () {
    return {
      drawer: null,
      accounts: [{
        id: 1,
        name: 'root',
        children: [
          {
            id: 2,
            name: 'Income',
            children: [
              {
                id: 3,
                name: 'salary'
              },
              {
                id: 4,
                name: 'Bonus'
              }
            ]
          },
          {
            id: 5,
            name: 'Expenses'
          },
          {
            id: 6,
            name: 'Assets'
          },
          {
            id: 7,
            name: 'Liabilities'
          }
        ]
      }]
    }
  }
}
</script>
