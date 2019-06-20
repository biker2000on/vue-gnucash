const { gql } = require('apollo-server')

const mutation = gql`
  type Mutation {
    """
    Update a transactions metadata and not the splits.
    """
    updateTransaction(
      guid: String!, 
      description: String, 
      post_date: String
    ): Transaction
    """
    Insert a new transaction with multiple splits.
    """
    insertTransaction(
      description: String! "transaction description", 
      post_date: String!, 
      account_guids: [ID!]! "array of all account_guids for all splits", 
      values: [Float!]!, 
      quantities: [Float], 
      memos: [String],
      actions: [Actions],
    ): Transaction
  }
`

module.exports = {
  mutation
}