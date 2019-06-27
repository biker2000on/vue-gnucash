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
  data: () => ({}),
  methods: {
    filter() {
      return true;
    }
  },
  computed: {
    columnOptions() {
      return {
        "*": {
          // headerInput: false,
          // headerFilter: false,
        },
        name: {
          name: "Name",
          cssClass: "text-left",
          formatter: function(row, cell, value, columnDef, dataContext) {
            // console.log("formatter");
            // console.log(row, cell, value, columnDef, dataContext);
            // return value;
            if (value == null || value == undefined || dataContext === undefined) {
              console.log('skipped', value, dataContext)
              return "";
            }

            value = value
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;");
            var spacer =
              "<span style='display:inline-block;height:1px;width:" +
              15 * dataContext["depth"] +
              "px'></span>";
            console.log('spacer ', spacer, dataContext)
            var idx = this.dataView.getIdxById(dataContext.guid);
            if (this.data[idx + 1] && this.data[idx + 1].indent > this.data[idx].depth) {
              if (dataContext._collapsed) {
                return spacer + " <span class='toggle expand'></span>&nbsp;" + value;
              } else {
                return (
                  spacer + " <span class='toggle collapse'></span>&nbsp;" + value
                );
              }
            } else {
              return spacer + " <span class='toggle'></span>&nbsp;" + value;
            }
          }
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
