const {accountResolver} = require('./account')
const {accountsResolver} = require('./accounts')
const {balancesResolver} = require('./balances')
const {accountTreeResolver} = require('./accountTree')
const {transactionsTableResolver} = require('./transactionsTable')
const {commoditiesResolver} = require('./commodities')
const {booksResolver} = require('./books')

const queryResolvers = [
  accountResolver,
  accountsResolver,
  accountTreeResolver,
  balancesResolver,
  transactionsTableResolver,
  commoditiesResolver,
  booksResolver,
]

module.exports = {
  queryResolvers
}