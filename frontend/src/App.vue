<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <v-sheet class="pa-3 primary lighten-2">
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
      @dblclick="open_tab"
       />
    </v-navigation-drawer>
    <v-toolbar fixed dark app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title class="headline text-uppercase">
        Gnucash Vue Flask
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
          v-model="active_tab"
          align-with-title
          dark
          slider-color="yellow"
        >
          <v-tab
            v-for="i in tabs"
            :key="i"
            :href="`#tab-${i}`"
          >
            Item {{ i }}
          </v-tab>
        </v-tabs>
      </template>
    </v-toolbar>

    <v-content>
      <Table :account_guid="active_account_guid" :flataccounts="accounts"/>
      <!-- <HelloWorld/> -->
    </v-content>
  </v-app>
</template>

<script>
import Table from './components/Table.vue'
import gql from 'graphql-tag'

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

const object_in_hierarchy = (guid, accounts) => {
  for (let acct of accounts) {
    if (acct.guid == guid) {
      return acct
    }
  }
  for (let acct of accounts) {
    if (acct.children) {
      // console.log(acct.children)
      let account = object_in_hierarchy(guid, acct.children)
      if (account) {
        return account
      }
    }
  }
  return undefined
}

function getObject(theObject, value) {
    var result = null;
    if(theObject instanceof Array) {
        for(var i = 0; i < theObject.length; i++) {
            result = getObject(theObject[i]);
        }
    }
    else
    {
      for(var prop in theObject) {
        if(prop == 'id') {
          if(theObject[prop] == value) {
            // console.log(prop + ': ' + theObject[prop]);
            return theObject;
          }
        }
        if(theObject[prop] instanceof Object || theObject[prop] instanceof Array) {
          result = getObject(theObject[prop]);
        }
      }
    }
    return result;
}

export default {
  name: 'App',
  components: {
    Table
  },
  data () {
    return {
      drawer: null,
      accounts: [],
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
      console.log(e)
      this.active_account_guid = e[0]
    }, 
    open_tab() {

    },
  },
  computed: {
    active_account() {
      return object_in_hierarchy(this.active_account_guid, this.accounts)
    },
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
      error(error) {
        this.error.push(JSON.stringify(error.message))
      }
    }
  }
}
</script>
