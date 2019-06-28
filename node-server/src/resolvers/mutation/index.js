const {transactionResolver} = require('./updateTransaction')
const {insertTransactionResolver} = require('./insertTransaction')
const {updateAccountResolver} = require('./updateAccount')
const {insertAccountResolver} = require('./insertAccount')
const {updateBudgetResolver} = require('./updateBudget')
const {insertBudgetResolver} = require('./insertBudget')

const mutationResolvers = [
  transactionResolver,
  insertTransactionResolver,
  updateAccountResolver,
  insertAccountResolver,
  updateBudgetResolver,
  insertBudgetResolver,
]

module.exports = {
  mutationResolvers
}