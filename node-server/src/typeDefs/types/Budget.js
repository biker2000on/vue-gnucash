const {gql} = require('apollo-server')

const Budget = gql`
  type Budget {
    guid: ID!
    name: String!
    description: String
    num_periods: Int!
    budget_amounts: [BudgetAmounts]
    """
    Id from the recurrences table. Auto-incrementing Integer
    """
    id: Int!
    recurrence_mult: Int!
    recurrence_period_type: Periods!
    """
    This is the start date of a budget or scheduled transaction in the form 'yyyymmdd'
    """
    recurrence_period_start: Text!
    """
    Can be none, back, forward
    """
    recurrence_weekend_adjust: WeekendAdjust!
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