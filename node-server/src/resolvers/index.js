const { queryResolvers } = require('./query')
const { typeResolvers } = require('./types')

const resolvers = [
  ...queryResolvers,
  ...typeResolvers
]

module.exports = {
  resolvers
}