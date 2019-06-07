const {gql} = require('apollo-server')

const Transaction = gql`
  type Transaction {
    guid: String!
    currency_guid: String!
    post_date: String!
    enter_date: String!
    description: String!
    splits: [Split!]!
  }


  """
  Optimized Transaction Lookup to return splits as JSON instead of querying the database individually for splits on each transaction.
  """
  type TransactionSplits {
    guid: ID!
    currency_guid: String!
    post_date: String!
    enter_date: String!
    description: String!
    account_guid: ID
    credit: Float
    debit: Float
    """
    Returned as JSON type of all splits for a given transaction. Cannot specify the fields to be returned.
    """
    splits: JSON!
  }
`

module.exports = {
 Transaction 
}