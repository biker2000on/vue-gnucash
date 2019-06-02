const {Account} = require('./Account')
const {Balance} = require('./Balance')
const {Book} = require('./Book')
const {Commodity} = require('./Commodity')
const {Lot} = require('./Lot')
const {Split} = require('./Split')
const {Transaction} = require('./Transaction')

const types = [
  Account,
  Balance,
  Book,
  Commodity,
  Lot,
  Split,
  Transaction,
]

module.exports = {
  types,
}