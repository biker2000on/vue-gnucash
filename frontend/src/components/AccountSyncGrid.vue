<template>
  <ejs-grid :dataSource="transactionsTable" :allowSorting="true" :allowFiltering="true" :allowGrouping="true">
    <e-columns>
      <e-column field="post_date" headerText="Date" textAlign="Left" width="120"></e-column>
      <e-column field="description" headerText="Description"></e-column>
      <e-column field="account_guid" headerText="Account" textAlign="Left" width="200"></e-column>
      <e-column field="debit_value" headerText="Debit" textAlign="Left" format="C2" width="100"></e-column>
      <e-column field="credit_value" headerText="Credit" textAlign="Left" format="C2" width="100"></e-column>
      <e-column field="balance" headerText="Balance" textAlign="Left" format="C2" width="100"></e-column>
    </e-columns>
  </ejs-grid>
</template>

<script>
import gql from "graphql-tag";
import getSymbolFromCurrency from "currency-symbol-map";
import { Page, Sort, Filter, Group } from "@syncfusion/ej2-vue-grids";

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
  props: {
    account_guid: {
      type: String,
      required: false
    },
    flataccounts: {
      type: Object,
      required: false,
      default: function() {
        return {};
      }
    },
    commodity: {
      type: String,
      required: false,
      default: "USD"
    }
  },
  data: () => ({
    transactionsTable: [],
    error: [],
    widths: 20
  }),
  provide: {
    grid: [Page, Sort, Filter, Group]
  },
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
            const val = cell.getValue();
            return formatterParams[val] ? formatterParams[val] : val;
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
      const symbol = getSymbolFromCurrency(this.commodity);
      return symbol ? symbol : this.commodity;
    }
  },
  mounted() {},
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
/* @import '../node_modules/@syncfusion/ej2-base/styles/material.css';   */
/* @import '../node_modules/@syncfusion/ej2-buttons/styles/material.css';  
  @import '../node_modules/@syncfusion/ej2-calendars/styles/material.css';  
  @import '../node_modules/@syncfusion/ej2-dropdowns/styles/material.css';  
  @import '../node_modules/@syncfusion/ej2-inputs/styles/material.css';  
  @import '../node_modules/@syncfusion/ej2-navigations/styles/material.css';
  @import '../node_modules/@syncfusion/ej2-popups/styles/material.css';
  @import '../node_modules/@syncfusion/ej2-splitbuttons/styles/material.css'; */
@import "../../node_modules/@syncfusion/ej2-vue-grids/styles/material.css";
</style>
