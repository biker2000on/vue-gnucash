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

// var aggregators = vuetiful.aggregators;
// var formatters = vuetiful.formatters;
// var currencies = vuetiful.maps.currencies;

// var customers = {
//     striped: true,
//     editable: false,
//     lineNumbers: false,
//     filter: null,

//     currency: "USD",
//     dateFormat: "D MMMM YYYY",
    
//     columns: [
//         {
//             id: "purchase_amount",
//             label: "Purchase Amount",
//             width: null,
//             sortable: true,
//             groupable: true,
//             aggregators: [],
//             // formatter: function (value) {
//             //     return formatters.currency(value, 2, customers.currency);
//             // }
//         }
//     ],

export default {
  components: {
    DatatableCell, DatatableCollective, DatatableColumn, Datatable, Toggle,
  },
  props: {
      account_guid: {
          type: String,
          required: false,
      },
      splits: {
          type: Array,
          required: false
      }
  },
  data: () => ({
    transactions: [],
  }), 
  methods: {
  
  },
  computed: {
    tableData() {
      const vm = this
      // console.log('inside tableData computed property')
      // console.log(vm.splits)
      // console.log(vm.account_guid)
      let mappedSplits = vm.splits.map(function (c) {
        for (let split of c.splits) {
          if (split.account_guid == vm.account_guid) {
            if (split.value > 0) {
              c['debit'] = split.value
              c['credit'] = ''
            } else {
              c['debit'] = ''
              c['credit'] = Math.abs(split.value)
            }
          }
        }
        return {
          post_date: c.post_date,
          description: c.description,
          account: c.splits[0].account_guid, //need to map to treeview
          debit: c.debit,
          credit: c.credit,
          balance: '',
        }
      })
      return mappedSplits
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
