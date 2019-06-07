<template>
  <datatable id="data-table-options" :source="tableData" filterable editable striped lineNumbers>
    <datatable-column id="post_date" label="Date" width="15"></datatable-column>
    <datatable-column id="description" label="Description" width="20"></datatable-column>
    <datatable-column id="account" label="Account" width="25"></datatable-column>
    <datatable-column id="debit" label="Debit" width="10"></datatable-column>
    <datatable-column id="credit" label="Credit" width="10"></datatable-column>
    <datatable-column id="balance" label="Balance" width="10"></datatable-column>
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
</template>

<script>
import DatatableCell from './datatable/datatable-cell.js'
import DatatableCollective from './datatable/datatable-collection.vue'
import DatatableColumn from './datatable/datatable-column.vue'
import Datatable from './datatable/datatable.vue'
import Toggle from './datatable/toggle.vue'
import gql from 'graphql-tag'

const ACCOUNT_TXSPLITS = gql`
  query {
    account(guid:"567f74beab5246a99b9610b8f0db3992") {
      guid
      transactionSplits {
        description
        post_date
        splits
      }
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
        type: Array,
        required: true,
      }
  },
  data: () => ({
    transactions: [],
    error: [],
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
    account: {
      query: ACCOUNT_TXSPLITS,
      // variables: {
      //   guid: '567f74beab5246a99b9610b8f0db3992'
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
      height: 100%;
  }
</style>
