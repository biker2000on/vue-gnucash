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
          <!-- <v-tab key="accountTree1" href="#tab-accountTree1">
            Accounts 
          </v-tab> -->
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
        <!-- <v-tab-item> -->
          <!-- <account-tree-tabulator v-if="accountTree" :accountTree="accountTree" /> -->
          <!-- Account Tree here. -->
        <!-- </v-tab-item> -->
        <v-tab-item v-for="tab in tabs" :key="tab" :value="'tab-' + tab">
          <account-tabulator 
          v-if="active_account_guid" 
          :account_guid="tab" 
          :flataccounts="accountNameMap"
          :commodity="active_commodity"
          />
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
import AccountTabulator from './components/AccountTabulator'
import {flattenToObject} from './utilities/flattenTree'
// import AccountTreeTabulator from './components/AccountTreeTabulator'

const ACCOUNT_TREE = gql`
  query {
    accountTree
  }
`

const COMMODITIES = gql`
  query {
    commodities {
      guid
      mnemonic
    }
  }
`

export default {
  name: 'App',
  components: {
    Tabulator,
    Navigation,
    AccountTabulator,
    // AccountTreeTabulator,
  },
  data () {
    return {
      drawer: null,
      search: null,
      active_account_guid: null,
      active_account: null,
      tabs: [],
      active_tab: null,
      splits: {},
      separator: ':',
      error: [],
    }
  },
  methods: {
    update_active(e) {
      if (e[0]) {
        const {children, ...account} = e[0] 
        this.active_account = account
        this.active_account_guid = e[0].guid
        if (this.tabs.includes(undefined)) {this.tabs.pop(this.tabs.indexOf(undefined))}
        if (this.tabs.includes(this.active_account_guid)) {
          this.active_tab = e[0].guid
        } else {
          this.tabs.push(e[0].guid)
          this.active_tab = 'tab-' + e[0].guid
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
    },
    accountNameMap() {
      return flattenToObject(
        this.accountTree,
        node => node.children,
        node => node.fullname,
        node => node.guid
      )
    },
    commoditityMap() {
      let map = {}
      this.commodities.map(c => {
        return map[c.guid] = c.mnemonic
      })
      return map
    },
    active_commodity() {
      return this.commoditityMap[this.active_account.commodity_guid]
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
    commodities: {
      query: COMMODITIES,
      error(error) {
        this.error.push(JSON.stringify(error.message))
      }
    }
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
