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
import Dinero from 'dinero.js'

Dinero.globalLocale = 'en-US'
Dinero.defaultAmount = 0;
Dinero.defaultCurrency = 'USD' // get from root account
Dinero.defaultPrecision = 2;

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
          map[c.account_guid]['bgt' + c.period_num] = {
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
      // console.log('tree', tree)
      this.accountMap = tree
    },
  },
  computed: {
    options() {
      return {
        height: this.height,
        dataTree: true,
        dataTreeChildField: 'children',
        dataTreeBranchElement: false,
        dataTreeChildIndent: 15,
        dataTreeStartExpanded: [true,false], // start with first 1 levels expanded
        columns: this.columns
      }
    },
    columns() {
      const vm = this
      let periods = []
      for (let i=0; i < this.budget.num_periods; i++) {
        periods.push({
          title: i + 1,
          field: 'bgt' + i,
          sorter: 'number',
          mutator: function (value, row, type, params, component) {
            console.log('mutator value', value, row, type, params, component)
            if (!value) return Dinero() // check for null
            if (type == 'data' && Object.keys(value).includes('amount_num')) { // make Dinero
              return Dinero({
                  amount: value.amount_num,
                  precision: Math.log10(value.amount_denom)
                })
            }
            return value // already Dinero object
            
          },
          formatter: function(cell, formatterParams, onRendered) {
            const val = cell.getValue()
            if (val.isZero()) {
              return ""
            } 
            return val.toFormat("$0,0.00")
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

