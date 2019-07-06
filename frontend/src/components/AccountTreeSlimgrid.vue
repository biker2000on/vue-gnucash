<template>
  <slim-grid
    v-if="flattenedAccounts"
    pk="guid"
    :data="flattenedAccounts"
    :column-options="columnOptions"
    :height="550"
    :explicit-columns="['name','description','fullname']"
    forceFitColumns
    fullWidthRows
    :downloadable="false"
    treeFilter
    :showHiddenRows="showHidden"
    ref="slimgridComp"
  />
</template>

<script>
import SlimGrid from "./SlimGrid";
import { flattenToArray } from "../utilities/flattenTree";

export default {
  components: {
    SlimGrid
  },
  props: {
    accountTree: {
      type: Array,
      required: true
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
    columnOptions() {
      return {
        "*": {
          cssClass: 'text-left'
          // headerFilter: false,
        },
        name: {
          name: "Name",
          cssClass: "text-left",
        },
        description: {
          name: "Description",
          cssClass: "text-left"
        }
      };
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
