<template>
  <div ref="table"></div>
</template>

<script>
import Tabulator from "tabulator-tables";
import gql from "graphql-tag";

const TXTABLE = gql`
  query($guid: String!) {
    transactionsTable(guid: $guid) {
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

// const cols = [
//   { title: "Date", field: "post_date", editor: true, align: "left" },
//   {
//     title: "Description",
//     field: "description",
//     variableHeight: true,
//     editor: true,
//     align: "left"
//   },
//   {
//     title: "Account",
//     field: "account_guid",
//     variableHeight: true,
//     editor: true,
//     align: "left",
//     formatter: "lookup",
//     formatterParams: this.accountMap
//   },
//   {
//     title: "Debit",
//     field: "debit_quantity",
//     editor: true,
//     align: "right",
//     formatter: "money",
//     formatterParams: {
//       decimal: ".",
//       thousand: ",",
//       symbol: "$",
//       precision: 2
//     }
//   },
//   {
//     title: "Credit",
//     field: "credit_quantity",
//     editor: true,
//     align: "right",
//     formatter: "money",
//     formatterParams: {
//       decimal: ".",
//       thousand: ",",
//       symbol: "$",
//       precision: 2
//     }
//   },
//   {
//     title: "Balance",
//     field: "balance",
//     editor: true,
//     align: "right",
//     formatter: "money",
//     formatterParams: {
//       decimal: ".",
//       thousand: ",",
//       symbol: "$",
//       precision: 2
//     }
//   }
// ];

export default {
  props: {
    account_guid: {
      type: String,
      required: false
    },
    flataccounts: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    tabulator: null,
    // tableData: [],
    transactionsTable: [],
    error: [],
    widths: 20,
    columns: []
  }),
  mounted() {
    this.tabulator = new Tabulator(this.$refs.table, {
      data: this.transactionsTable,
      reactiveData: true,
      columns: [
        { title: "Date", field: "post_date", editor: true, align: "left", editor: true },
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
          formatter: "lookup",
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
      ],
      layout: "fitDataFill"
    });
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
        queryResult.data.transactionsTable.reduce((a,c,i) => {
          // if (c.account_guid) {
          //   try {
          //     c.account_guid = this.flataccounts[c.account_guid].fullname;
          //   } catch {}
          // }
          c['balance'] = a + c.debit_quantity - c.credit_quantity
          a = c.balance
          try {
            c.splits = JSON.parse(c.splits);
          } catch {}
          return a
        },0);
        this.tabulator.replaceData(queryResult.data.transactionsTable);
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
}
</style>
