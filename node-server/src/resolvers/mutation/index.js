const {transactionResolver} = require('./updateTransaction')
const {insertTransactionResolver} = require('./insertTransaction')
const {updateAccountResolver} = require('./updateAccount')
const {insertAccountResolver} = require('./insertAccount')
const {updateBudgetResolver} = require('./updateBudget')
const {insertBudgetResolver} = require('./insertBudget')
const {insertBudgetAmountsResolver} = require('./insertBudgetAmounts')
const {updateBudgetAmountsResolver} = require('./updateBudgetAmounts')

const mutationResolvers = [
  transactionResolver,
  insertTransactionResolver,
  updateAccountResolver,
  insertAccountResolver,
  updateBudgetResolver,
  insertBudgetResolver,
  insertBudgetAmountsResolver,
  updateBudgetAmountsResolver,
]

module.exports = {
  mutationResolvers
}