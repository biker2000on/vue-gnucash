const { gql } = require('apollo-server')

const query = gql`
  type Query {
    account(guid: String!): Account
    accounts: [Account!]!
    balances: [Balance!]!
    """
    The accountTree query returns a JSON string of the full hierarchy of accounts including name, guid, and children.
    """
    accountTree: JSON
    """
    Transactions table query returns the data needed to reconstruct the Gnucash transaction journal.
    """
    transactionsTable(guid: String!): [TransactionSplits!]!
  }
`

module.exports = {
  query
}