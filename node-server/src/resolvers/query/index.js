const {accountResolver} = require('./account')
const {accountsResolver} = require('./accounts')
const {balancesResolver} = require('./balances')

const queryResolvers = [
  accountResolver,
  accountsResolver,
  balancesResolver,
]

module.exports = {
  queryResolvers
}