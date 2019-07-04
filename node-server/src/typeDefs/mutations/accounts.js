const {gql} = require('apollo-server')

const accounts = gql`
  extend type Mutation {
    updateAccount(
      account: UpdateAccountInput!
    ): Account

    insertAccount(
      account: InsertAccountInput!
    ): Account
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
`

module.exports = {
  accounts
}