const { gql } = require('apollo-server')

const transactions = gql`
  type Mutation {
    """
    Update a transactions with splits. Must include all splits relevant to transaction for update otherwise you will get a validation error. 
    """
    updateTransaction(
      guid: String!, 
      description: String, 
      post_date: String
      splits: [UpdateSplitInput]
    ): Transaction

    """
    Insert a transaction with multiple splits
    """
    insertTransaction(
      description: String!
      post_date: String!
      splits: [InsertSplitInput]
    ): Transaction
  }

  input InsertSplitInput {
    "account_guid that this split maps to"
    account_guid: ID!
    "Value of transaction"
    value: Float!
    "Quantity of transaction. Will equal value on same-same currency transaction. Will not equal value on stock or multi-currency transactions."
    quantity: Float
    "comment / memo for the split. This is in addition to the description on the transaction"
    memo: String
    "Enum of possible split actions related to stock / mutual fund movements."
    action: Actions
  }

  input UpdateSplitInput {
    guid: ID!
    account_guid: ID!
    value: Float!
    quantity: Float
    memo: String
    action: Actions
    reconcile_state: String
    reconcile_date: String
  } 
`

module.exports = {
  transactions
}