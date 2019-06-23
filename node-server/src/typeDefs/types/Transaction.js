const {gql} = require('apollo-server')

const Transaction = gql`
  type Transaction {
    guid: String!
    currency_guid: String!
    post_date: String!
    enter_date: String!
    description: String!
    notes: String
    splits: [Split!]!
  }


  """
  Optimized Transaction Lookup to return splits as JSON instead of querying the database individually for splits on each transaction. Also returns all data needed for table display of splits.
  """
  type TransactionSplits {
    guid: ID!
    currency_guid: String!
    post_date: String!
    enter_date: String!
    description: String!
    """
    This account guid is the opposing account GUID that is not a TRADING account or the current account.
    """
    account_guid: ID
    debit_value: Float
    credit_value: Float
    debit_quantity: Float
    credit_quantity: Float
    """
    Returned as JSON type of all splits for a given transaction. Cannot specify the fields to be returned.
    """
    splits: JSON!
  }
`

module.exports = {
 Transaction 
}