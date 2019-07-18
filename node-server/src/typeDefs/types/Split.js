const {gql} = require('apollo-server')

const Split = gql`
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
    quantity_num: Int!
    quantity_denom: Int!
    value: Float!
    value_num: Int!
    value_denom: Int!
    lot: Lot
    lot_guid: String!
  }
`

module.exports = {
 Split 
}