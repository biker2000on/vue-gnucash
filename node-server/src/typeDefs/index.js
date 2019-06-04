const {query} = require("./query");
const {types} = require("./types");
const scalars = require('./scalars')

const typeDefs = [query, ...types, scalars];

module.exports = {
  typeDefs,
};