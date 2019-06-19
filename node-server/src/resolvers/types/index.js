const { accountResolver } = require('./accounts')
const { splitResolver } = require('./splits')
const { txResolver } = require('./transactions')
// const { commoditiesResolver } = require('./commodities')
// const { booksResolver } = require('./books')

const typeResolvers = [
  accountResolver, 
  splitResolver, 
  txResolver, 
//  commoditiesResolver, 
//  booksResolver,
]

module.exports = {
  typeResolvers,
}