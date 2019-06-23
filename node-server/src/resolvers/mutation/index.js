const {transactionResolver} = require('./updateTransaction')
const {insertTransactionResolver} = require('./insertTransaction')
const {updateAccountResolver} = require('./updateAccount')
const {insertAccountResolver} = require('./insertAccount')

const mutationResolvers = [
  transactionResolver,
  insertTransactionResolver,
  updateAccountResolver,
  insertAccountResolver,
]

module.exports = {
  mutationResolvers
}