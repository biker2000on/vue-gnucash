import gql from 'graphql-tag'

export const ACCOUNT_TREE = gql`
  query getAccountTree {
    accountTree
  }
`

export const ACCOUNTS = gql`
  query getAccounts {
    accounts {
      account_type
      code 
      commodity_guid
      commodity_scu
      depth
      description
      fullname
      guid
      parent_guid
      hidden
      name
      non_std_scu
      placeholder
    }
  }
`

export const BUDGETS = gql`
  query getBudgets {
    budgets {
      guid
      name
    }
  }
`

export const COMMODITIES = gql`
  query getCommodities {
    commodities {
      guid
      mnemonic
    }
  }
`

export const BUDGET = gql`
  query getBudget($guid:ID!) {
    budget(guid:$guid) {
      name
      description
      num_periods
      recurrence_mult
      recurrence_period_type
      recurrence_period_start
      recurrence_weekend_adjust
      budget_amounts {
        id
        period_num
        amount_num
        amount_denom
        account_guid
      }
    }
  }
`

export const BOOKS = gql`
  query getBook {
    books {
      root_account_guid
      root_account {
        commodity_guid
        commodity {
          mnemonic
        }
      }
    }
  }
`