const GraphQLJSON = require('graphql-type-json');
const { GraphQLJSONObject } = require('graphql-type-json')

const scalarResolvers = {
  JSON: GraphQLJSON,
  JSONObject: GraphQLJSONObject,
};

module.exports = {
  scalarResolvers
}