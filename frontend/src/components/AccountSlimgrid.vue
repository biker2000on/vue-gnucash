<template>
  <slim-grid 
    pk="guid"
    :data="transactionsTable"
    :column-options="columnOptions"
  />
</template>

<script>
import gql from "graphql-tag";
import SlimGrid from 'vue-slimgrid'
import getSymbolFromCurrency from 'currency-symbol-map'

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

export default {
  components: {
    SlimGrid
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
    },
    commodity: {
      type: String,
      required: false,
      default: 'USD',
    }
  },
  data: () => ({
    transactionsTable: [],
    error: [],
    widths: 20,
    columnOptions: {
      '*': {  // all column / default options

      }, 
      splits: {
        columns: [
          {
            id: "debit_value",
            name: 'Debit'
          },
          {
            id: "credit_value",
            name: "Credit"
          },
          {
            id: 'account_guid',
            name: 'Account'
          }
        ]
      },
      __typename: {
        hidden: true
      },
      debit_quantity: {hidden: true},
      credit_quantity: {hidden: true},
    }
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
            values: this.flataccounts,
            sortValuesList: "asc"
          },
          align: "left",
          formatter: function(cell, formatterParams, onRendered) {
            const val = cell.getValue()
            return formatterParams[val] ? formatterParams[val] : val
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
            symbol: this.symbol,
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
            symbol: this.symbol,
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
            symbol: this.symbol,
            precision: 2
          }
        }
      ];
    },
    symbol() {
      const symbol = getSymbolFromCurrency(this.commodity)
      return symbol ? symbol : this.commodity
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

<style>

  @import "../../node_modules/vue-slimgrid/dist/slimgrid.css";
  
</style>



