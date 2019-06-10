<template>
  <div ref="table"></div>
</template>

<script>
import Tabulator from 'tabulator-tables'
import gql from 'graphql-tag'

const TXTABLE = gql`
  query ($guid:String!) {
    transactionsTable(guid:$guid) {
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
`

const cols = [
  {title: "Date", field: "post_date"},
  {title: "Description", field: "description"},
  {title: "Account", field: "account_guid"},
  {title: "Debit", field: "debit_quantity"},
  {title: "Credit", field: "credit_quantity"},
  {title: "Balance", field: "balance"},
]

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
    columns: cols,
  }),
  // watch:{
  //   //update table if data changes
  //   transactionsTable:{
  //     handler: function (newData) {
  //       console.log("newData inside watcher: ", newData)
  //       this.tabulator.replaceData(newData);
  //     },
  //     deep: true,
  //   }
  // },
  mounted() {
    this.tabulator = new Tabulator(this.$refs.table, {
      data: this.transactionsTable,
      reactiveData: true,
      columns: this.columns,
    })
  },
  apollo: {
    transactionsTable: {
      query: TXTABLE,
      variables() {
        return {
          guid: this.account_guid
        }
      },
      update() {
        console.log('updating')
      },
      result(queryResult) {
        console.log("result")
        queryResult.data.transactionsTable.map(c => {
          if (c.account_guid) {
            try {
              c.account_guid = this.flataccounts[c.account_guid].fullname
            } 
            catch {
              
            }
          }
          if (!c.account_guid) console.log("blank line")
        })
        this.tabulator.replaceData(queryResult.data.transactionsTable)
        return queryResult
        // console.log(queryResult)
      },
      // skip() {
      //   return Boolean(this.account_guid)
      // },
      error(error) {
        this.error.push(JSON.stringify(error.message))
      },
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
