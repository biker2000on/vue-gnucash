const { queryResolvers } = require('./query')
const { typeResolvers } = require('./types')
const { scalarResolvers } = require('./scalars')

const resolvers = [
  ...queryResolvers,
  ...typeResolvers,
  scalarResolvers,
]

module.exports = {
  resolvers
}