<template>
  <vue-tabulator
    v-if="accountMap"
    v-model="accountMap"
    :options="options"
    ref="tabulator"
  />
</template>

<script>
import { flattenToArray, flattenToObject } from "../utilities/flattenTree";
import { makeTreeFromObject } from '../utilities/makeTree'
import { BUDGET } from '../assets/js/root-queries'

export default {
  props: {
    budget_guid: {
      type: String,
      required: false,
    },
    accountTree: {
      type: Array,
      required: true,
      default: null,
    },
    height: {
      type: Number,
      default: 550,
    }
  },
  data: () => ({
    showHidden: false,
    accountMap: null,
    budget: null,
  }),
  methods: {
    mapAccounts() {
      let map = flattenToObject(
        this.accountTree,
        node => node.children,
        node => {
          let bgt = {}
          if (this.budget) {
            for (let i=0; i < this.budget.num_periods; i++) {
              bgt['bgt' + i] = null
              bgt['subtotal' + i] = 0
            }
          }
          let { children, ...flat } = node
          return {...flat, ...bgt}
        },
        node => node.guid
      )
      if (this.budget) {
        this.budget.budget_amounts.map(c => {
          map[c.account_guid][c.period_num] = {
            amount_num: c.amount_num,
            amount_denom: c.amount_denom,
            id: c.id,
          }
        })
      }
      const tree = makeTreeFromObject(
        map, 
        "parent_guid",
        "children",
        "fd4dd79886327b270a0fa8efe6a07972"
      )
      console.log('tree', tree)
      this.accountMap = tree
    },
  },
  computed: {
    options() {
      const vm = this
      return {
        height: this.height,
        dataTree: true,
        dataTreeChildField: 'children',
        dataTreeBranchElement: false,
        dataTreeChildIndent: 15,
        dataTreeStartExpanded: [true,true,false], // start with first 2 levels expanded
        columns: vm.columns
      }
    },
    columns() {
      const vm = this
      let periods = []
      for (let i=0; i < this.budget.num_periods; i++) {
        periods.push({
          title: i + 1,
          field: 'bdg' + i,
          sorter: 'number',
          formatter: function(cell, formatterParams, onRendered) {
            const val = cell.getValue()
            if (!val) {
              return ""
            }
            return val.amount_num
          },
        })
      }
      return [
        {
          title: 'Name',
          field: 'name',
          sorter: "string",
          align: 'left'
        },
        {
          title: 'Description',
          field: 'description',
          align: 'left',
        }, 
        ...periods
      ]
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
    }, 
  },
  watch: {
    budget(newer, old) {
      this.mapAccounts()
    }
  },
  apollo: {
    budget: {
      query: BUDGET,
      variables() {
        return {
          guid: this.budget_guid
        }
      }
    }
  }
};
</script>

<style lang="scss">
@import "../../node_modules/vue-tabulator/dist/scss/tabulator.scss";
</style>

