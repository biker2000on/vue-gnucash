const {transactionResolver} = require('./updateTransaction')
const {insertTransactionResolver} = require('./insertTransaction')

const mutationResolvers = [
  transactionResolver,
  insertTransactionResolver,
]

module.exports = {
  mutationResolvers
}