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
      <Table :account_guid="active_account_guid" :flataccounts="flatAccounts" :splits="splits[active_account_guid] ? splits[active_account_guid].results : undefined"/>
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
      flatAccounts: [],
      error: [],
    }
  },
  methods: {
    get_accounts() {
      axios.get('http://localhost:5000/accounts')
        .then((response) => this.accounts = response.data)
        .catch((error) => console.error(error))
    },
    update_active(e) {
      this.active_account_guid = e[0]
      this.getSplits(e[0])
    }, 
    open_tab() {

    },
    getSplits(account_guid) {
      axios.get('http://localhost:5000/account/' + account_guid + '/transactions')
        .then((response) => {
          if (account_guid in this.splits) {
            this.splits[account_guid].results.concat(response.data.results)
            this.splits[account_guid].previous = response.data.previous
            this.splits[account_guid].next = response.data.next
          } else {
            this.splits[account_guid] = response.data
          }
        })
        .catch((error) => (console.warn(error)))
    },
    moreSplits(url_partial) {
      axios.get('http://localhost:5000' + url_partial)
        .then((response) => this.splits.append(response.data.results))
    },
    accountName(account, parentName='', separator=':') {
      const name = parentName + separator + account.name
      let names = [name]
      if (Boolean(...account.children)) {
        for (acc of account.children) {
          return names.push(...accountName(acc, name, separator))
        }
      }
      return names
    },
    getFlatAccounts() {
      axios.get('http://localhost:5000/accounts_flat')
        .then(response => {
          this.flatAccounts = response.data
        })
    },
  },
  computed: {
    active_account() {
      return object_in_hierarchy(this.active_account_guid, this.accounts)
    },
    fullnameAccounts() {
      let all = []
      for (a of accounts) {
        all.push(...this.accountName(a,'',separator))
      }
    }
  },
  created() {
    this.getFlatAccounts()
    // this.get_accounts()
  },
  apollo: {
    accountTree: {
      query: ACCOUNT_TREE,
      error(error) {
        this.error = JSON.stringify(error.message)
      }
    }
  }
}
</script>
