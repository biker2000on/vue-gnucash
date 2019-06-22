<template>
  <tabulator
    v-if="transactionsTable.length > 1"
    :columns="columns"
    :tableData="transactionsTable"
    :tabulatorSettings="tabulatorSettings"
  />
</template>

<script>
import gql from "graphql-tag";
import Tabulator from "./Tabulator";

const TXTABLE = gql`
  query($guid: String!) {
    transactionsTable(guid: $guid) {
      guid
      account_guid
      description
      post_date
      debit_value
      credit_value
      debit_quantity
      credit_quantity
      splits
    }
  }
`;

const tabulatorSettings = {
  cellEdited: function(cell) {
    // console.log(cell._cell.row)
    console.log(cell._cell.column.field);
    console.log(cell._cell.row.data);
  },
  layout: "fitDataFill"
};

export default {
  components: {
    Tabulator
  },
  props: {
    account_guid: {
      type: String,
      required: false
    },
    flataccounts: {
      type: Object,
      required: false,
      default: function () {
        return {}
      }
    }
  },
  data: () => ({
    transactionsTable: [],
    error: [],
    widths: 20,
    tabulatorSettings: tabulatorSettings,
  }),
  computed: {
    columns() {
      return [
        {
          title: "Date",
          field: "post_date",
          editor: true,
          align: "left",
          editor: true,
          minWidth: 100
        },
        {
          title: "Description",
          field: "description",
          variableHeight: true,
          editor: true,
          align: "left"
        },
        {
          title: "Account",
          field: "account_guid",
          variableHeight: true,
          editor: "autocomplete",
          editorParams: {
            showListOnEmpty: true,
            freetext: false,
            allowEmpty: false,
            // searchFunc: function(term, values) {
            //   //search for exact matches
            //   var matches = [];
            //   values.forEach(function(item) {
            //     if (item.value === term) {
            //       matches.push(item);
            //     }
            //   });
            //   return matches;
            // },
            values: this.flataccounts.fullname,
            sortValuesList: "asc"
          },
          align: "left",
          formatter: function(cell, formatterParams, onRendered) {
            const val = cell.getValue()
            return formatterParams[val] ? formatterParams[val].fullname : val
          },
          formatterParams: this.flataccounts
        },
        {
          title: "Debit",
          field: "debit_quantity",
          editor: "number",
          align: "right",
          formatter: "money",
          formatterParams: {
            decimal: ".",
            thousand: ",",
            symbol: "$",
            precision: 2
          }
        },
        {
          title: "Credit",
          field: "credit_quantity",
          editor: "number",
          align: "right",
          formatter: "money",
          formatterParams: {
            decimal: ".",
            thousand: ",",
            symbol: "$",
            precision: 2
          }
        },
        {
          title: "Balance",
          field: "balance",
          align: "right",
          formatter: "money",
          formatterParams: {
            decimal: ".",
            thousand: ",",
            symbol: "$",
            precision: 2
          }
        }
      ];
    }
  },
  mounted() {

  },
  apollo: {
    transactionsTable: {
      query: TXTABLE,
      variables() {
        return {
          guid: this.account_guid
        };
      },
      update(data) {
        console.log("updating: ", data);
        return data.transactionsTable;
      },
      result(queryResult) {
        console.log("result");
        queryResult.data.transactionsTable.reduce((a, c, i) => {
          // if (c.account_guid) {
          //   try {
          //     c.account_guid = this.flataccounts[c.account_guid].fullname;
          //   } catch {}
          // }
          c["balance"] = a + c.debit_quantity - c.credit_quantity;
          a = c.balance;
          try {
            c.splits = JSON.parse(c.splits);
          } catch {}
          return a;
        }, 0);
        return queryResult;
        // console.log(queryResult)
      },
      // skip() {
      //   return Boolean(this.account_guid)
      // },
      error(error) {
        this.error.push(JSON.stringify(error.message));
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../node_modules/tabulator-tables/dist/css/tabulator_modern.css";

div {
  width: 100%;
  height: 600px;
}
</style>
