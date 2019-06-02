const {gql} = require('apollo-server')

const Balance = gql`
  type Balance {
    balance: Float
    quantity: Float
    value: Float
    account_guid: String!
  }
`

module.exports = {
 Balance 
}