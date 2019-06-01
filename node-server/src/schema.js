const {gql} = require('apollo-server')

const typeDefs = gql`
  type Account {
    guid: String!
    name: String!
    account_type: String!
    balance: Balance
    commodity_guid: String!
    commodity: Commodity!
    children: [Account]
    parent: Account
    description: String!
    hidden: Boolean
    placeholder: Boolean
    splits: [Split]
    transactions: [Transaction]
  }

  type Transaction {
    guid: String!
    currency_guid: String!
    post_date: String!
    enter_date: String!
    description: String!
    splits: [Split!]!
  }

  type Split {
    guid: String!
    transaction_guid: String!
    transaction: Transaction!
    account_guid: String!
    account: Account!
    memo: String!
    action: String!
    reconcile_state: String!
    reconcile_date: String!
    quantity: Float!
    value: Float!
    lot: Lot
    lot_guid: String!
  }

  type Lot {
    guid: ID!
    account_guid: ID!
    account: Account!
    is_closed: Boolean!
    splits: [Split]
  }

  type Commodity {
    guid: String!
    namespace: String!
    mnemonic: String!
    fullname: String
    cusip: String!
    fraction: Int!
    quote_flag: Boolean!
    quote_source: String!
    quote_tz: String!
  }

  type Balance {
    balance: Float
    quantity: Float
    value: Float
    account_guid: String!
  }

  type Query {
    account(guid: String!): Account
    accounts: [Account!]!
    balances: [Balance!]!
  }

`

module.exports = typeDefs