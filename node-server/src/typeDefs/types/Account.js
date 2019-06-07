const {gql} = require('apollo-server')

const Account = gql`
  type Account {
    guid: String!
    name: String!
    account_type: String!
    balance: Balance
    commodity_guid: String!
    commodity: Commodity!
    children: [Account]
    parent: Account
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