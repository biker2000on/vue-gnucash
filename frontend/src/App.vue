<template>
  <v-app>
    <Navigation
      :accountTree="accountTree"
      :budgets="budgets"
      @update-account="tabsUpdate($event, 'account')"
      @update-budget="tabsUpdate($event, 'budget')"
      @home-click="tabsUpdate('accountTree', 'accountTree')"
      :drawer.sync="drawer"
    />
    <v-toolbar fixed app dark color="primary">
      <v-toolbar-side-icon @click.stop="toggleNav($event)"></v-toolbar-side-icon>
      <v-toolbar-title class="headline text-uppercase">Gnucash Vue GraphQL</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn flat href="https://gnucash.org" target="_blank">
        <span class="mr-2">Gnucash</span>
      </v-btn>

      <template v-slot:extension>
        <v-tabs
          v-if="tabs.length"
          v-model="active_tab"
          align-with-title
          slider-color="accent"
          color="primary"
          dark
        >
          <v-tab v-for="tab in tabsClean" :key="tab.id" :to="routerNav(tab)" >
            {{ tab.name + ' ' }}
            <span
              @click="closeTab(tab)"
              class="close error"
            >x</span>
          </v-tab>
        </v-tabs>
      </template>
    </v-toolbar>

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import Navigation from "./components/Navigation";
import { flattenToObject } from "./utilities/flattenTree";
import { makeTree } from "./utilities/makeTree";
import { ACCOUNTS, BUDGETS, COMMODITIES, BOOKS } from "./assets/js/root-queries";

export default {
  name: "App",
  components: {
    Navigation,
  },
  data() {
    return {
      drawer: null,
      search: null,
      active_account_guid: null,
      active_account: null,
      tabs: [],
      tabsClean: [],
      active_tab: null,
      splits: {},
      separator: ":",
      error: [],
      windowHeight: 300,
      contentHeight: 550,
      books: null,
    };
  },
  methods: {
    updateRouter(event) {
      this.$router.push(event)
    },
    routerNav(tab) {
      if (tab.name == 'account') {
        return {
          name: tab.name,
          params: {
            account_guid: tab.id,
            flataccounts: this.accountNameMap,
            type_map: this.flattenedAccountsMap,
            commodity: this.active_commodity,
            height: this.contentHeight
          }
        }
      }
      if (tab.name == 'budget') {
        return {
          name: tab.name,
          params: {
            budget_guid: tab.id,
            accountTree: this.accountTree,
            height: this.contentHeight,
          }
        }
      }
      if (tab.name == 'accountTree') {
        return {
          name: tab.name,
          params: {
            accountTree: this.accountTree
          }
        }
      }
    },
    buildTab(id, name) {
      let tab = {
        id,
        name,
      }
      tab.route = this.routerNav(tab)
      return tab
    },
    updateTab(tab) {
      if (this.tabs.includes(undefined)) {
        this.tabs.pop(this.tabs.indexOf(undefined));
      }
      const filt = this.tabs.filter(c => c == tab)
      if (!filt.length) {
        this.tabs.push(tab)
      } 
      // this.active_tab = tab
    },
    tabsUpdate(e, name) { // need to update
      let tab
      if (name == 'account') {
        if (e[0]) {
          this.active_account_guid = e[0];
          tab = this.buildTab(e[0], name)
        }
      } else {
        tab = this.buildTab(e, name)
      }
      this.computeHeight()
      this.updateTab(tab)
    },
    computeHeight() {
      const top = this.$vuetify.application.top
      const bottom = this.$vuetify.application.bottom
      this.contentHeight = this.windowHeight - top - bottom
    },
    closeTab(key) {
      if (this.tabs.includes(key)) {
        this.tabs.splice(this.tabs.indexOf(key), 1);
      }
    },
    toggleNav(e) {
      this.drawer = !this.drawer;
    }
    // refreshTab(prop) {
    //   this.$root.$emit('refresh-grid')
    // }
  },
  computed: {
    accountTree() {
      if (this.accounts) {
        const tree = makeTree(
          this.accounts,
          "guid",
          "parent_guid",
          "children",
          "fd4dd79886327b270a0fa8efe6a07972"
        );
        return tree;
      }
      return [];
    },
    flattenedAccountsMap() {
      return flattenToObject(
        this.accountTree,
        node => node.children,
        node => {
          let { children, guid, ...flat } = node;
          return flat;
        },
        node => node.guid
      );
    },
    budgetMap() {
      let budgetMap = {}
      if (this.budgets) {
        this.budgets.forEach(c => {
          budgetMap[c.guid] = c
        });
      }
      return budgetMap
    },
    accountNameMap() {
      return flattenToObject(
        this.accountTree,
        node => node.children,
        node => node.fullname,
        node => node.guid
      );
    },
    commoditityMap() {
      let map = {};
      this.commodities.map(c => {
        return (map[c.guid] = c.mnemonic);
      });
      return map;
    },
    active_commodity() {
      if (this.active_account_guid) {
        return this.commoditityMap[this.flattenedAccountsMap[this.active_account_guid].commodity_guid];
      }
      return null
    }
  },
  watch: {
    tabs(newTab, oldTab) {
      this.tabsClean = this.tabs.filter(c => c)
    }
  },
  mounted() {
    this.tabsUpdate('accountTree','accountTree')
    this.$nextTick(() => {
      window.addEventListener('resize', () => {
        this.windowHeight = window.innerHeight
      });
      this.windowHeight = window.innerHeight
    })
  },
  apollo: {
    accounts: {
      query: ACCOUNTS,
      error(error) {
        this.error.push(JSON.stringify(error.message));
      }
    },
    commodities: {
      query: COMMODITIES,
      error(error) {
        this.error.push(JSON.stringify(error.message));
      }
    },
    budgets: {
      query: BUDGETS,
      error(error) {
        this.error.push(JSON.stringify(error.message));
      }
    },
    books: {
      query: BOOKS,
      error(error) {
        this.error.push(JSON.stringify(error.message));
      }
    },
  }
};
</script>

<style lang="scss">
.close {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-left: 5px;
}
</style>
