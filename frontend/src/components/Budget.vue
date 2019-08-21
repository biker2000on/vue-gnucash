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
import moment from 'moment'
import { traverseDF } from '../utilities/traverseTree'

const periodTypeMap = {
  year: {step: 'year', format: 'YYYY'},
  month: {step: 'month', format: 'MMM'},
  week: {step: 'week', format: 'ww'},
  day: {step: 'day', format: 'DDD'},
}

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
    dineroDefaults() {
      Dinero.globalLocale = 'en-US'
      Dinero.defaultAmount = 0;
      Dinero.defaultCurrency = 'USD' // get from root account
      Dinero.defaultPrecision = 2;
    },
    mapAccounts() {
      if (!this.budget) return
      this.dineroDefaults()
      let map = flattenToObject(
        this.accountTree,
        node => node.children,
        node => {
          let bgt = {}
          for (let i=0; i < this.budget.num_periods; i++) {
            bgt['bgt' + i] = { amount: Dinero(), subtotal: Dinero() }
            // bgt['subtotal' + i] = { amount: Dinero(), type: 'subtotal' }
          }
          let { children, ...flat } = node
          return {...flat, ...bgt}
        },
        node => node.guid
      )
      this.budget.budget_amounts.map(c => {
        let amt = Dinero({
          amount: c.amount_num,
          precision: Math.log10(c.amount_denom)
        })
        map[c.account_guid]['bgt' + c.period_num] = { 
          amount: amt,
          subtotal: amt
        }
      })
      const tree = makeTreeFromObject(
        map, 
        "parent_guid",
        "children",
        "fd4dd79886327b270a0fa8efe6a07972", // root account guid
        this.budget.num_periods
      )
      // console.log('tree', tree)
      this.accountMap = tree
      console.log('check on budget traverse')
      traverseDF(this.accountMap, node => console.log(node.name))
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
      let start = moment(this.budget.recurrence_period_start)
      const stepSize = this.budget.recurrence_period_type
      const recMult = this.budget.recurrence_mult
      const type = periodTypeMap[stepSize]
      for (let i=0; i < this.budget.num_periods; i++) {
        periods.push({
          title: start.format(type.format),
          field: 'bgt' + i,
          sorter: 'number',
          formatter: function(cell, formatterParams, onRendered) {
            const val = cell.getValue()
            const el = cell.getElement()
            if (val.amount.isZero()) { // if amount is 0 (and subtotal != 0) then it must be a subtotal
              el.classList.add('subtotal')
              return val.subtotal.toFormat("$0,0.00")
            } 
            return val.amount.toFormat("$0,0.00")
          },
          editor: "number",
          mutatorEdit(value, data, type, params, component) {
            let amtString = value.toString()
            let amt = Dinero({
              amount: Number(amtString.replace(/\./, '')),
              precision: amtString.length - amtString.indexOf('.') - 1
            })
            return { amount: amt, subtotal: amt }
          }
        })
        start.add(recMult, type.step)
      }
      return [
        {
          title: 'Name',
          field: 'name',
          sorter: "string",
          align: 'left'
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
.subtotal {
  color: grey;
}
</style>

