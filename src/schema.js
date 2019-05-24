const {gql} = require('apollo-server')

const typeDefs = gql`
  type User {
    id: Int!
    name: String!
    email: String!
    recipes: [Recipe!]!
  }

  type Recipe {
    id: Int!
    title: String!
    ingredients: String!
    directions: String!
    user: User!
  }

  type Query {
    user(id: Int!): User
    allRecipes: [Recipe!]!
    recipe(id: Int!): Recipe
  }

  type Mutation {
    insert_user(name: String!, email: String!, password: String!): User!
    insert_recipe(
      userId: Int!
      title: String!
      ingredients: String!
      directions: String!
    ): Recipe!
  }
`

module.exports = typeDefs