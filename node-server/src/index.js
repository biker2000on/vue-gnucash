const { ApolloServer } = require('apollo-server')
const typeDefs = require('./schema')
const resolvers = require('./resolvers')
const knex = require("../db/knex");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: { knex }
})

server.listen()
  .then(({ url }) => console.log('Server is running on localhost:4000'))