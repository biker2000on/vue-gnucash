<template>
  <vue-tabulator
    v-if="accountTree"
    v-model="accountTree"
    :options="options"
    ref="tabulator"
  />
</template>

<script>
import { flattenToArray } from "../utilities/flattenTree";

export default {
  props: {
    accountTree: {
      type: Array,
      required: true,
      default: null,
    },
    height: {
      type: Number,
      default: 550,
    }
  },
  data: () => ({
    showHidden: false,
  }),
  methods: {
    filter() {
      return true;
    }
  },
  computed: {
    options() {
      const vm = this
      return {
        height: this.height,
        dataTree: true,
        dataTreeChildField: 'children',
        dataTreeBranchElement: false,
        dataTreeChildIndent: 15,
        dataTreeStartExpanded: [true,true,false], // start with first 2 levels expanded
        columns: vm.columns
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
    }
  }
};
</script>

<style lang="scss">
@import "../../node_modules/vue-tabulator/dist/scss/tabulator.scss";
</style>

