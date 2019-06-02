const { accountResolver } = require('./accounts')
const { splitResolver } = require('./splits')
// const { transactionsResolver } = require('./transactions')
// const { commoditiesResolver } = require('./commodities')
// const { booksResolver } = require('./books')

const typeResolvers = [
  accountResolver, 
  splitResolver, 
//  transactionsResolver, 
//  commoditiesResolver, 
//  booksResolver,
]

module.exports = {
  typeResolvers,
}