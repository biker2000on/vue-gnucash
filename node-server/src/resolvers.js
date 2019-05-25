const sequelize = require('sequelize')

const resolvers = {
  Query: {
    async account (root, {guid}, {models}) {
      return models.accounts.findByPk(guid)
    },
    async accounts (root, args, {models}) {
      return models.accounts.findAll()
    },
  },
  Account: {
    async balance (account) {
      const accBalance =  await account.getSplits({
        attributes: [[sequelize.fn('SUM', sequelize.col('value_num')), 'balance']],
        raw: true,
      })
      console.log(accBalance)
      return accBalance[0].balance
    },
    async commodity (account) {
      return account.getCommodity()
    },
    async splits (account) {
      return account.getSplits()
    },
    async children (account) {
      return account.getAccounts()
    },
    async parent (account) {
      return account.getAccount()
    },
  },
  Split: {
    async quantity (split) {
      return split.quantity_num / split.quantity_denom
    },
    async value (split) {
      return split.value_num / split.value_denom
    }
  }
}

module.exports = resolvers