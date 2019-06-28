const {gql} = require('apollo-server')

const Budget = gql`
  type Budget {
    guid: ID!
    name: String!
    description: String
    num_periods: Int!
    budget_amounts: [BudgetAmounts]
  }

  type BudgetAmounts {
    id: Int!
    budget_guid: ID!
    account_guid: ID!
    account: Account!
    period_num: Int!
    amount_num: Int!
    amount_denom: Int!
    amount: Float
  }
`

module.exports = {
  Budget
}