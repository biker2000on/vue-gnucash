const { gql } = require('apollo-server')

const query = gql`
  type Query {
    account(guid: String!): Account
    accounts: [Account!]!
    balances: [Balance!]!
  }
`

module.exports = {
  query
}