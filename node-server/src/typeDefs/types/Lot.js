const {gql} = require('apollo-server')

const Lot = gql`
  type Lot {
    guid: ID!
    account_guid: ID!
    account: Account!
    is_closed: Boolean!
    splits: [Split]
  }
`

module.exports = {
 Lot 
}