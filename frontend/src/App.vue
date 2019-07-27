<template>
  <v-app>
    <Navigation
      :accountTree="accountTree"
      :budgets="budgets"
      @update-account="update_active($event)"
      @update-budget="update_budget($event)"
      @home-click="goHome($event)"
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
          <v-tab v-for="i in tabs" :key="i" :href="`#tab-${i}`">
            {{ i == 'accountTree1' ? 'Accounts' : 
              flattenedAccountsMap[i] ? flattenedAccountsMap[i].name + ' ' :
              budgetMap[i] ? budgetMap[i].name + ' ' : '' }}
            <span
              @click="closeTab(i)"
              class="close error"
            >x</span>
          </v-tab>
        </v-tabs>
      </template>
    </v-toolbar>

    <v-content>
      <!-- <v-container fill-height> -->
      <v-tabs-items v-model="active_tab">
        <v-tab-item v-for="tab in tabs" :key="tab" :value="'tab-' + tab">
          <account-tree-tabulator
            v-if="tab == 'accountTree1' && accountTree"
            :accountTree="accountTree"
            ref="grid"
          />
          <account-tabulator
            v-if="active_account_guid  && accountNameMap && tab != 'accountTree1'"
            :account_guid="tab"
            :flataccounts="accountNameMap"
            :commodity="active_commodity"
            :type_map="flattenedAccountsMap"
            ref="grid"
          />
          <budget 
            v-if="budgetMap[tab] && accountTree" 
            :accountTree="accountTree" 
            ref="grid" 
          />
        </v-tab-item>
      </v-tabs-items>
      <!-- </v-container> -->
    </v-content>
  </v-app>
</template>

<script>
import AccountSlimgrid from "./components/AccountSlimgrid.vue";
import AccountTabulator from "./components/AccountTabulator";
import Navigation from "./components/Navigation";
import { flattenToObject } from "./utilities/flattenTree";
import AccountTreeSlimgrid from "./components/AccountTreeSlimgrid";
import AccountTreeTabulator from "./components/AccountTreeTabulator";
import { makeTree } from "./utilities/makeTree";
import { ACCOUNTS, BUDGETS, COMMODITIES } from "./assets/js/root-queries";
import Budget from "./components/Budget";

export default {
  name: "App",
  components: {
    Navigation,
    AccountSlimgrid,
    // AccountTreeSlimgrid,
    AccountTabulator,
    AccountTreeTabulator,
    Budget
  },
  data() {
    return {
      drawer: null,
      search: null,
      active_account_guid: null,
      active_account: null,
      tabs: ["accountTree1"],
      active_tab: null,
      splits: {},
      separator: ":",
      error: [],
      windowHeight: 300,
      contentHeight: 550,
    };
  },
  methods: {
    goHome(e) {
      if (!this.tabs.includes("accountTree1")) {
        this.tabs.unshift("accountTree1");
      }
      this.active_tab = "tab-accountTree1";
    },
    update_active(e) {
      if (e[0]) {
        const { children, ...account } = e[0];
        this.active_account = account;
        this.active_account_guid = e[0].guid;
        this.computeHeight()
        if (this.tabs.includes(undefined)) {
          this.tabs.pop(this.tabs.indexOf(undefined));
        }
        if (this.tabs.includes(this.active_account_guid)) {
          this.active_tab = e[0].guid;
        } else {
          this.tabs.push(e[0].guid);
          this.active_tab = "tab-" + e[0].guid;
        }
      }
    },
    computeHeight() {
      const top = this.$vuetify.application.top
      const bottom = this.$vuetify.application.bottom
      this.contentHeight = this.windowHeight - top - bottom
    },
    update_budget(guid) {
      this.computeHeight()
      if (!this.tabs.includes(guid)) {
        this.tabs.push(guid)
      }
      this.active_tab = 'tab-' + guid
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
      this.budgets.forEach(c => {
        budgetMap[c.guid] = c
      });
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
      return this.commoditityMap[this.active_account.commodity_guid];
    }
  },
  mounted() {
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
    }
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
