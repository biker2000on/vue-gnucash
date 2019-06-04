const { gql } = require('apollo-server')

const scalars = gql`
  scalar JSON
  scalar JSONObject
`

module.exports = scalars