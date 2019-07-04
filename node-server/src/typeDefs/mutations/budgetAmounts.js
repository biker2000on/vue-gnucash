const { gql } = require('apollo-server')

const budgetAmounts = gql`
  extend type Mutation {
    
    insertBudgetAmounts(
      budget_guid: ID!
      amounts: [InsertBudgetAmountInput!]!
    ): [BudgetAmounts!]!

    updateBudgetAmounts(
      budget_guid: ID!
      amounts: [UpdateBudgetAmountInput!]!
    ): [BudgetAmounts!]!
  }

  input InsertBudgetAmountInput {
    account_guid: ID!
    """
    The period_num is 0-indexed so December is 11 on an annual monthly budget.
    """
    period_num: Int!
    amount_num: Int!
    amount_denom: Int
  }

  input UpdateBudgetAmountInput {
    id: Int!
    account_guid: ID
    """
    The period_num is 0-indexed so December is 11 on an annual monthly budget.
    """
    period_num: Int
    amount_num: Int
    amount_denom: Int
  }
`

module.exports = {
  budgetAmounts
}