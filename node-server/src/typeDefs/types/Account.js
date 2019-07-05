const {gql} = require('apollo-server')

const Account = gql`
  type Account {
    guid: String!
    name: String!
    account_type: String!
    balance: Balance
    code: String
    commodity_guid: String!
    commodity_scu: Int!
    commodity: Commodity!
    children: [Account]
    parent: Account
    parent_guid: ID!
    non_std_scu: Int
    fullname: String
    description: String!
    hidden: Boolean
    placeholder: Boolean
    splits: [Split]
    transactions: [Transaction]
    transactionSplits: [TransactionSplits]
    depth: Int!
  }
`

module.exports = {
  Account
}