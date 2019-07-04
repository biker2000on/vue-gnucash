const {updateTransactionResolver} = require('./updateTransaction')
const {insertTransactionResolver} = require('./insertTransaction')
const {updateAccountResolver} = require('./updateAccount')
const {insertAccountResolver} = require('./insertAccount')
const {updateBudgetResolver} = require('./updateBudget')
const {insertBudgetResolver} = require('./insertBudget')
const {insertBudgetAmountsResolver} = require('./insertBudgetAmounts')
const {updateBudgetAmountsResolver} = require('./updateBudgetAmounts')
const {deleteAccountResolver} = require('./deleteAccount')
const {deleteBudgetResolver} = require('./deleteBudget')
const {deleteBudgetAmountsResolver} = require('./deleteBudgetAmounts')
const {deleteTransactionResolver} = require('./deleteTransaction')


const mutationResolvers = [
  updateTransactionResolver,
  insertTransactionResolver,
  updateAccountResolver,
  insertAccountResolver,
  updateBudgetResolver,
  insertBudgetResolver,
  insertBudgetAmountsResolver,
  updateBudgetAmountsResolver,
  deleteAccountResolver,
  deleteBudgetAmountsResolver,
  deleteBudgetResolver,
  deleteTransactionResolver,
]

module.exports = {
  mutationResolvers
}