const {accountResolver} = require('./account')
const {accountsResolver} = require('./accounts')
const {balancesResolver} = require('./balances')
const {accountTreeResolver} = require('./accountTree')

const queryResolvers = [
  accountResolver,
  accountsResolver,
  accountTreeResolver,
  balancesResolver,
]

module.exports = {
  queryResolvers
}