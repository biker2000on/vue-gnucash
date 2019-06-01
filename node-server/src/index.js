const { ApolloServer } = require('apollo-server')
const typeDefs = require('./schema')
const resolvers = require('./resolvers')
const knex = require("../db/knex");
// const { SQLDataSource } = require("datasource-sql");

// const knex = new Knex({
//   client: 'sqlite3',
//   connection: {
//     filename: './mymoney.sqlite'
//   },
//   debug: true,
// })

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: { knex }
})

server.listen()
  .then(({ url }) => console.log('Server is running on localhost:4000'))