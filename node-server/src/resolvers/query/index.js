const {accountResolver} = require('./account')
const {accountsResolver} = require('./accounts')
const {balancesResolver} = require('./balances')
const {accountTreeResolver} = require('./accountTree')
const {transactionsTableResolver} = require('./transactionsTable')
const {commoditiesResolver} = require('./commodities')
const {booksResolver} = require('./books')
const {budgetResolver} = require('./budget')

const queryResolvers = [
  accountResolver,
  accountsResolver,
  accountTreeResolver,
  balancesResolver,
  transactionsTableResolver,
  commoditiesResolver,
  booksResolver,
  budgetResolver,
]

module.exports = {
  queryResolvers
}