<template>
  <v-app>
    <Navigation :accountTree="accountTree" @update-account="update_active($event)" :drawer.sync="drawer" />
    <v-toolbar fixed app dark color="primary">
      <v-toolbar-side-icon @click.stop="toggleNav($event)"></v-toolbar-side-icon>
      <v-toolbar-title class="headline text-uppercase">
        Gnucash Vue GraphQL
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        flat
        href="https://gnucash.org"
        target="_blank"
      >
        <span class="mr-2">Gnucash</span>
      </v-btn>

      <template v-slot:extension>
        <v-tabs
          v-if="tabs.length > 0"
          v-model="active_tab"
          align-with-title
          slider-color="accent"
          color="primary"
          dark
        >
          <v-tab key="accountTree1" href="#tab-accountTree1">
            Accounts 
          </v-tab>
          <v-tab
            v-for="i in tabs"
            :key="i"
            :href="`#tab-${i}`"
          >
            {{ flattenedAccountsMap[i] ? flattenedAccountsMap[i].name + ' ' : '' }} <span @click="closeTab(i)" class="close error">x</span>
          </v-tab>
        </v-tabs>
      </template>
    </v-toolbar>

    <v-content>
      <!-- <v-container fill-height> -->
      <v-tabs-items v-model="active_tab">
        <v-tab-item>
          <!-- <account-tree-tabulator v-if="accountTree" :accountTree="accountTree" /> -->
          Account Tree here.
        </v-tab-item>
        <v-tab-item v-for="tab in tabs" :key="tab" :value="'tab-' + tab">
          <account-tabulator v-if="active_account_guid" :account_guid="tab" :flataccounts="flattenedAccountsMap"/>
        </v-tab-item>
      </v-tabs-items>
      <!-- </v-container> -->
    </v-content>
  </v-app>
</template>

<script>
import Tabulator from './components/Tabulator.vue'
import Navigation from './components/Navigation'
import gql from 'graphql-tag'
import object_in_hierarchy from './utilities/object-in-hierarchy'
import AccountTabulator from './components/AccountTabulator'
import {flattenToObject} from './utilities/flattenTree'
import AccountTreeTabulator from './components/AccountTreeTabulator'

const ACCOUNT_TREE = gql`
  query {
    accountTree
  }
`

export default {
  name: 'App',
  components: {
    Tabulator,
    Navigation,
    AccountTabulator,
    AccountTreeTabulator,
  },
  data () {
    return {
      drawer: null,
      search: null,
      active_account_guid: null,
      tabs: [],
      active_tab: null,
      splits: {},
      separator: ':',
      error: [],
    }
  },
  methods: {
    update_active(e) {
      this.active_account_guid = e[0]
      if (e[0]) {
        if (this.tabs.includes(undefined)) {this.tabs.pop(this.tabs.indexOf(undefined))}
        if (this.tabs.includes(this.active_account_guid)) {
          this.active_tab = e[0]
        } else {
          this.tabs.push(e[0])
          this.active_tab = 'tab-' + e[0]
        }
      }
    }, 
    closeTab(key) {
      if (this.tabs.includes(key)) {this.tabs.splice(this.tabs.indexOf(key),1)}
    },
    toggleNav(e) {
      this.drawer = !this.drawer
    }
  },
  computed: {
    active_account() {
      return object_in_hierarchy(this.active_account_guid, this.accountTree)
    },
    flattenedAccountsMap() {
      return flattenToObject(
        this.accountTree,
        node => node.children,
        node => {
          let {children, guid, ...flat} = node
          return flat
        },
        node => node.guid
      )
    }
  },
  created() {

  },
  apollo: {
    accountTree: {
      query: ACCOUNT_TREE,
      error(error) {
        this.error.push(JSON.stringify(error.message))
      }
    },
  }
}
</script>

<style lang="scss">
  .close {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin-left: 5px;
  }
</style>
