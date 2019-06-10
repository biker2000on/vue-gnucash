<template>
  <div>
    <v-progress-circular v-if="$apollo.queries.transactionsTable.loading" indeterminate />
    <datatable v-if="account_guid" id="data-table-options" :source="transactionsTable" filterable striped editable>
      <datatable-column id="post_date" label="Date" width="20"></datatable-column>
      <datatable-column id="description" label="Description" width="20"></datatable-column>
      <datatable-column id="account_guid" label="Account" width="20"></datatable-column>
      <datatable-column id="debit_quantity" label="Debit" width="20"></datatable-column>
      <datatable-column id="credit_quantity" label="Credit" width="20"></datatable-column>
      <!-- <datatable-column id="balance" label="Balance" width="10"></datatable-column> -->
      <template slot="sortable" slot-scope="cell">
          <div class="datatable-options-toggle">
              <toggle :id="cell.row.id + '-sortable'" v-model="cell.row.sortable"></toggle>
          </div>
      </template>
      <template slot="groupable" slot-scope="cell">
          <div class="datatable-options-toggle">
              <toggle :id="cell.row.id + '-groupable'" v-model="cell.row.groupable"></toggle>
          </div>   
      </template>
    </datatable>
  </div>
</template>

<script>
import DatatableCell from './datatable/datatable-cell.js'
import DatatableCollective from './datatable/datatable-collection.vue'
import DatatableColumn from './datatable/datatable-column.vue'
import Datatable from './datatable/datatable.vue'
import Toggle from './datatable/toggle.vue'
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

export default {
  components: {
    DatatableCell, DatatableCollective, DatatableColumn, Datatable, Toggle,
  },
  props: {
      account_guid: {
          type: String,
          required: false,
      },
      flataccounts: {
        type: Object,
        required: true,
      }
  },
  data: () => ({
    transactions: [],
    error: [],
    widths: 20
  }), 
  methods: {
  
  },
  computed: {
    tableData() {
      const vm = this
      if (!vm.account) return []
      // console.log(vm.account.transactionSplits)
      let splits = vm.account.transactionSplits
      // console.log('inside tableData computed property')
      // console.log(vm.splits)
      // console.log(vm.account_guid)
      let mappedSplits = splits.map(function (c) {
        for (let split of c.splits) {
          // console.log('inside split map')
          if (split.account_guid == vm.account.guid) {
            if (split.value > 0) {
              c['debit'] = split.value_num / split.value_denom
              c['credit'] = ''
            } else {
              c['debit'] = ''
              c['credit'] = Math.abs(split.value_num / split.value_denom)
            }
          }
        }
        return {
          post_date: c.post_date,
          description: c.description,
          account: 'placeholder', // need account map + logic for which split to display
          debit: c.debit,
          credit: c.credit,
          balance: '',
        }
      })
      return mappedSplits
    }
  },
  apollo: {
    transactionsTable: {
      query: TXTABLE,
      variables() {
        return {
          guid: this.account_guid
        }
      },
      result(queryResult) {
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
}
</script>

<style>
  #data-table-options {
      width: 100%;
      /* height: 100%; */
  }
</style>
