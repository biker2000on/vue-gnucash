const { gql } = require('apollo-server')

const mutation = gql`
  type Mutation {
    """
    Update a transactions metadata and not the splits.
    """
    updateTransaction(guid: String!, description: String, post_date: String): Transaction
    """
    Insert a new transaction that is a simple transfer with only 2 accounts. 
    """
    insertTransaction(description: String, post_date: String, from_account_guid: ID, to_account_guid: ID, from_value: Float, to_value: Float): Transaction
    """
    Insert a new transaction with multiple splits.
    """
    insertTransactionSplits(description: String, post_date: String, account_guids: [ID], values: [Float], quantities: [Float]): Transaction
  }
`

module.exports = {
  mutation
}