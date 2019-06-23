const {accountResolver} = require('./account')
const {accountsResolver} = require('./accounts')
const {balancesResolver} = require('./balances')
const {accountTreeResolver} = require('./accountTree')
const {transactionsTableResolver} = require('./transactionsTable')
const {commoditiesResolver} = require('./commodities')

const queryResolvers = [
  accountResolver,
  accountsResolver,
  accountTreeResolver,
  balancesResolver,
  transactionsTableResolver,
  commoditiesResolver,
]

module.exports = {
  queryResolvers
}