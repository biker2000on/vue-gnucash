const {budgetAmounts} = require('./budgetAmounts')
const {budgets} = require('./budgets')
const {accounts} = require('./accounts')
const {transactions} = require('./transactions')

const mutations = [
  // mutation,
  budgetAmounts,
  budgets,
  accounts,
  transactions,
]

module.exports = {
  mutations
}