const { gql } = require('apollo-server')

const query = gql`
  type Query {
    account(guid: String!): Account
    accounts(guid: String): [Account!]!
    """
    The accountTree query returns a JSON string of the full hierarchy of accounts including name, guid, and children.
    """
    accountTree: JSON
    books: [Book]
    balances: [Balance!]!
    budgets: [Budget!]!
    budget(guid: ID!): Budget!
    commodities: [Commodity!]!
    """
    Transactions table query returns the data needed to reconstruct the Gnucash transaction journal.
    """
    transactionsTable(guid: String!): [TransactionSplits!]!
  }
`

module.exports = {
  query
}