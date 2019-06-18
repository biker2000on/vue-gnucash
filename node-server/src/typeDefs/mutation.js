const { gql } = require('apollo-server')

const mutation = gql`
  type Mutation {
    """
    Update a transactions metadata and not the splits.
    """
    transaction(guid: String!, description: String, post_date: String): Transaction
  }
`

module.exports = {
  mutation
}