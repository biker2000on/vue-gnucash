const { gql } = require('apollo-server')

const query = gql`
  type Query {
    account(guid: String!): Account
    accounts: [Account!]!
    balances: [Balance!]!
    """
    The accountTree query returns a JSON string of the full hierarchy of accounts including name, guid, and children.
    """
    accountTree: String
  }
`

module.exports = {
  query
}