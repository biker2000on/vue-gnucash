<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <v-sheet class="pa-3 primary ">
        <v-text-field
            v-model="search"
            label="Search Account Tree"
            dark
            flat
            solo-inverted
            hide-details
            clearable
            clear-icon="mdi-close-circle-outline"
          >
        </v-text-field>
      </v-sheet>
      <v-progress-circular v-if="$apollo.queries.accountTree.loading" indeterminate />
      <v-treeview 
      :items="accountTree"
      :search="search"
      activatable
      hoverable
      item-key="guid"
      @update:active="update_active($event)"
       />
    </v-navigation-drawer>
    <v-toolbar fixed app dark color="primary">
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
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
          <v-tab
            v-for="i in tabs"
            :key="i"
            :href="`#tab-${i}`"
          >
            {{ accountMap[i] ? accountMap[i].name + ' ' : '' }} <span @click="closeTab(i)" class="close error">x</span>
          </v-tab>
        </v-tabs>
      </template>
    </v-toolbar>

    <v-content>
      <v-tabs-items v-model="active_tab">
        <v-tab-item v-for="tab in tabs" :key="tab" :value="'tab-' + tab">
          <tabulator v-if="active_account_guid" :account_guid="tab" :flataccounts="accountNameMap"/>
        </v-tab-item>
      </v-tabs-items>
      <!-- <HelloWorld/> -->
    </v-content>
  </v-app>
</template>

<script>
import Tabulator from './components/Tabulator.vue'
// import Table from './components/Table.vue'
import gql from 'graphql-tag'
import object_in_hierarchy from './utilities/object-in-hierarchy'

const ACCOUNT_TREE = gql`
  query {
    accountTree
  }
`

const ACCOUNTS = gql`
  query {
    accounts {
      guid
      name
      fullname
    }
  }
`

export default {
  name: 'App',
  components: {
    // Table,
    Tabulator,
  },
  data () {
    return {
      drawer: null,
      accounts: [],
      accountMap: {},
      search: null,
      active_account_guid: null,
      tabs: [],
      active_tab: null,
      splits: {},
      next: null,
      previous: null,
      separator: ':',
      error: [],
    }
  },
  methods: {
    update_active(e) {
      // console.log(e, "update_active")
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
      // console.log(key, this.accountMap[key].fullname)
      if (this.tabs.includes(key)) {this.tabs.splice(this.tabs.indexOf(key),1)}
    }
  },
  computed: {
    active_account() {
      return object_in_hierarchy(this.active_account_guid, this.accountTree)
    },
    accountNameMap() {
      const map = {}
      this.accounts.map(c => {
        map[c.guid] = c.fullname
      })
      return map
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
    accounts: {
      query: ACCOUNTS,
      update(data) {
        // console.log("updating: ")
        return data.accounts
      },
      result(query) {
        // console.log("Results query")
        let accountMap = {}
        let accountNameMap = {}
        query.data.accounts.map(c => {
          accountMap[c.guid] = c
        })
        this.accountMap = accountMap
      },
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
