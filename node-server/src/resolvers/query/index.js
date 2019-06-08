const {accountResolver} = require('./account')
const {accountsResolver} = require('./accounts')
const {balancesResolver} = require('./balances')
const {accountTreeResolver} = require('./accountTree')
const {transactionsTableResolver} = require('./transactionsTable')

const queryResolvers = [
  accountResolver,
  accountsResolver,
  accountTreeResolver,
  balancesResolver,
  transactionsTableResolver,
]

module.exports = {
  queryResolvers
}