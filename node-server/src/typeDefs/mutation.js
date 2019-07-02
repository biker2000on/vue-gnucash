const { gql } = require('apollo-server')

const mutation = gql`
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

    updateAccount(
      account: UpdateAccountInput!
    ): Account

    insertAccount(
      account: InsertAccountInput!
    ): Account

    insertBudget(
      budget: InsertBudgetInput!
    ): Budget 

    updateBudget(
      budget: UpdateBudgetInput!
    ): Budget 
    
    insertBudgetAmounts(
      budget_guid: ID!
      amounts: [InsertBudgetAmountInput!]!
    ): [BudgetAmounts!]!

    updateBudgetAmounts(
      budget_guid: ID!
      amounts: [UpdateBudgetAmountInput!]!
    ): [BudgetAmounts!]!

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

  input InsertAccountInput {
    name: String!
    account_type: Account_Type!
    "GUID of commodity for account. Defaults to book default Commodity."
    commodity_guid: ID
    "Only the root account has a null parent_guid, so this value is required."
    parent_guid: ID!
    description: String
    "Should this account be shown or not?"
    hidden: Boolean
    "Should this account have transactions / splits associated with it?"
    placeholder: Boolean
  }

  input UpdateAccountInput {
    guid: ID!
    name: String
    account_type: Account_Type
    "GUID of commodity for account. Defaults to book default Commodity."
    commodity_guid: ID
    "Only the root account has a null parent_guid, so this value is required."
    parent_guid: ID
    "Please enter a description for the account."
    description: String
    "Should this account be shown or not?"
    hidden: Boolean
    "Should this account have transactions / splits associated with it?"
    placeholder: Boolean
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
  mutation
}