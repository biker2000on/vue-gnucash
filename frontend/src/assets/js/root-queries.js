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