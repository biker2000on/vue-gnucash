<template>
  <slim-grid v-if="flataccounts" 
    pk="guid" 
    :data="transactionsTable" 
    :column-options="columnOptions" 
    :height="550" 
    forceFitColumns 
    fullWidthRows 
    editable
    enableAddRow
    leaveSpaceForNewRows
    :downloadable="false"

  />
</template>

<script>
import gql from "graphql-tag";
import SlimGrid from "vue-slimgrid";
import getSymbolFromCurrency from "currency-symbol-map";
import { Editors } from 'slickgrid-es6' 

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

const options = {
  forceFitColumns: true,
}

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
    widths: 20,
    options: options
  }),
  computed: {
    columnOptions() {
      console.log("editor: ",Editors)
      const self = this
      return {
        "*": {
          editor: Editors.Text
          // all column / default options
        },
        post_date: {
          name: "Date",
          width: 100,
          order: 1
        },
        description: {
          name: "Description",
          cssClass: 'text-left',
          order: 2,
          minWidth: 100,
          // editor: Editors.Text
        },
        account_guid: {
          name: "Account",
          cssClass: 'text-left',
          width: 300,
          formatter: function(row, cell, value, columnDef, dataContext) {
            return self.flataccounts[value];
          },
          order: 3,
        },
        debit_value: {
          name: "Debit",
          minWidth: 100,
          order: 4,
          // editor: Editors.Number
        },
        credit_value: {
          name: "Credit",
          minWidth: 100,
          order: 5, 
        },
        balance: {
          name: "Balance",
          minWidth: 100,
          order: 6,
        },
        splits: {
          columns: [
            {
              id: "debit_value",
              name: "Debit",
              width: 100
            },
            {
              id: "credit_value",
              name: "Credit",
              width: 100
            },
            {
              id: "account_guid",
              name: "Account",
              width: 200
            }
          ],
          hidden: true,
        },
        __typename: { hidden: true },
        debit_quantity: { hidden: true },
        credit_quantity: { hidden: true },
      };
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
@import "../../node_modules/vue-slimgrid/dist/slimgrid.css";

</style>



