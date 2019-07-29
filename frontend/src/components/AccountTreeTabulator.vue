<template>
  <vue-tabulator
    v-if="accountTree.length"
    v-model="accountTree"
    :options="options"
    ref="tabulator"
  />
</template>

<script>
import { flattenToArray } from "../utilities/flattenTree";
import { ACCOUNTS } from '../assets/js/root-queries'
import { makeTree } from '../utilities/makeTree'

export default {
  data: () => ({
    showHidden: false,
    accounts: [],
    height: 550,
  }),
  methods: {
    computeHeight() {
      const top = this.$vuetify.application.top
      const bottom = this.$vuetify.application.bottom
      this.height = window.innerHeight - top - bottom
    },
    filter() {
      return true;
    }
  },
  computed: {
    options() {
      return {
        height: this.height,
        dataTree: true,
        dataTreeChildField: 'children',
        dataTreeBranchElement: false,
        dataTreeChildIndent: 15,
        dataTreeStartExpanded: [true,true,false], // start with first 2 levels expanded
        columns: this.columns
      }
    },
    columns() {
      const vm = this
      return [
        {
          title: 'Name',
          field: 'name',
          sorter: "string",
          align: 'left'
        },
        {
          title: 'Description',
          field: 'description',
          align: 'left',
        }
      ]
    },
    flattenedAccounts() {
      return flattenToArray(
        this.accountTree,
        node => node.children,
        node => {
          let { children, ...flat } = node;
          return flat;
        },
        node => node.guid
      );
    },
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
    }
  },
  mounted() {
    this.computeHeight()
  },
  apollo: {
    accounts: {
      query: ACCOUNTS,
      error(error) {
        this.error.push(JSON.stringify(error.message));
      }
    },
  }
};
</script>

<style lang="scss">
@import "../../node_modules/vue-tabulator/dist/scss/tabulator.scss";
</style>

