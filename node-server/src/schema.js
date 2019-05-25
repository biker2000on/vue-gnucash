const {gql} = require('apollo-server')

const typeDefs = gql`
  type Account {
    guid: String!
    name: String!
    account_type: String!
    balance: Float
    commodity_guid: String!
    commodity: Commodity!
    children: [Account]
    parent: Account
    description: String!
    hidden: Boolean
    placeholder: Boolean
    splits: [Split]
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
    value: Float!
    quantity: Float!
    lot_guid: String!
    lot: Lot
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

  type Query {
    account(guid: String!): Account
    accounts: [Account!]!
  }

`

module.exports = typeDefs