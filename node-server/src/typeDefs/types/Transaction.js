const {gql} = require('apollo-server')

const Transaction = gql`
  type Transaction {
    guid: String!
    currency_guid: String!
    post_date: String!
    enter_date: String!
    description: String!
    splits: [Split!]!
  }
`

module.exports = {
 Transaction 
}