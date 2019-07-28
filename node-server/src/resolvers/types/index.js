const { accountResolver } = require('./accounts')
const { splitResolver } = require('./splits')
const { txResolver } = require('./transactions')
const { budgetResolver } = require('./budgets')
const { booksResolver } = require('./books')

// const { commoditiesResolver } = require('./commodities')

const typeResolvers = [
  accountResolver, 
  splitResolver, 
  txResolver, 
  budgetResolver,
  booksResolver,
//  commoditiesResolver, 
]

module.exports = {
  typeResolvers,
}