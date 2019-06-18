const {query} = require("./query");
const {mutation} = require('./mutation')
const {types} = require("./types");
const scalars = require('./scalars')

const typeDefs = [query, mutation, ...types, scalars];

module.exports = {
  typeDefs,
};