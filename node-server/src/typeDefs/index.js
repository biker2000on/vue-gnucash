const {query} = require("./query");
const {mutations} = require('./mutations')
const {types} = require("./types");
const scalars = require('./scalars')
const {enums} = require('./enum')

const typeDefs = [query, ...mutations, ...types, scalars, enums];

module.exports = {
  typeDefs,
};