const { gql } = require('apollo-server')

const budgets = gql`
  extend type Mutation {
    insertBudget(
      budget: InsertBudgetInput!
    ): Budget 

    updateBudget(
      budget: UpdateBudgetInput!
    ): Budget 

    deleteBudget(
      guid: ID!
    ): Int
  }

  input InsertBudgetInput {
    name: String!
    """
    Optional budget description.
    """
    description: String
    """
    This number should be the total number of periods, whether in weeks, months, quarters, etc...
    """
    num_periods: Int!
    """
    Multiplier on the period type, ie every 2 weeks. 3 months = 1 quarter, etc...
    """
    recurrence_mult: Int!
    recurrence_period_type: Periods!
    """
    This is the start date of a budget or scheduled transaction in the form 'yyyymmdd'
    """
    recurrence_period_start: String!
    """
    Can be none, back, forward
    """
    recurrence_weekend_adjust: WeekendAdjust!
  }

  input UpdateBudgetInput {
    guid: ID!
    name: String
    """
    Optional budget description.
    """
    description: String
    """
    This number should be the total number of periods, whether in weeks, months, quarters, etc...
    """
    num_periods: Int
    """
    Multiplier on the period type, ie every 2 weeks. 3 months = 1 quarter, etc...
    """
    recurrence_mult: Int
    recurrence_period_type: Periods
    """
    This is the start date of a budget or scheduled transaction in the form 'yyyymmdd'
    """
    recurrence_period_start: String
    """
    Can be none, back, forward
    """
    recurrence_weekend_adjust: WeekendAdjust
  }

`

module.exports = {
  budgets
}