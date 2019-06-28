const { accountResolver } = require('./accounts')
const { splitResolver } = require('./splits')
const { txResolver } = require('./transactions')
const { budgetResolver } = require('./budgets')

// const { commoditiesResolver } = require('./commodities')
// const { booksResolver } = require('./books')

const typeResolvers = [
  accountResolver, 
  splitResolver, 
  txResolver, 
  budgetResolver,
//  commoditiesResolver, 
//  booksResolver,
]

module.exports = {
  typeResolvers,
}