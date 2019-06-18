const { queryResolvers } = require('./query')
const { mutationResolvers } = require('./mutation')
const { typeResolvers } = require('./types')
const { scalarResolvers } = require('./scalars')

const resolvers = [
  ...mutationResolvers,
  ...queryResolvers,
  ...typeResolvers,
  scalarResolvers,
]

module.exports = {
  resolvers
}