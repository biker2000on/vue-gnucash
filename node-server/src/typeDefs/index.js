const {query} = require("./query");
const {mutation} = require('./mutation')
const {types} = require("./types");
const scalars = require('./scalars')
const {enums} = require('./enum')

const typeDefs = [query, mutation, ...types, scalars, enums];

module.exports = {
  typeDefs,
};