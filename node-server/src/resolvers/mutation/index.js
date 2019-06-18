const {transactionResolver} = require('./transaction')

const mutationResolvers = [
  transactionResolver,

]

module.exports = {
  mutationResolvers
}