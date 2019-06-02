const {gql} = require('apollo-server')

const Book = gql`
  type Book {
    root_account: Account!
  }
`

module.exports = {
  Book
}