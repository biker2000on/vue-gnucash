const {gql} = require('apollo-server')

const Book = gql`
  type Book {
    root_account_guid: ID!
    root_template_guid: ID!
    root_account: Account
  }
`

module.exports = {
  Book
}