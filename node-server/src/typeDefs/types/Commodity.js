const {gql} = require('apollo-server')

const Commodity = gql`
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
`

module.exports = {
 Commodity 
}