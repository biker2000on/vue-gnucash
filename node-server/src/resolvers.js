const sequelize = require('sequelize')
// const models = require('../models')

const resolvers = {
  Query: {
    async account (root, {guid}, {knex}) {
      console.log(guid)
      return knex('accounts').select().where('guid','=', '346723ca372c085551eb2fe8fc3f01f1')
    },
    async accounts (root, args, {knex}) {
      return knex.select().from('accounts')
    },
    async balances (root, args, {knex}) {
      return models.splits.findAll({
        attributes: [[sequelize.fn('SUM',sequelize.literal('value_num / value_denom')), 'balance'], 
                      'account_guid', 
                      'value_denom',
                    ],
        group: 'account_guid',
        raw: true,
      })
    }
  },
  Account: {
    async balance (account, args, {models}) { // still needs work
      const accBalance =  await account.getSplits({
        attributes: [[sequelize.fn('SUM', sequelize.literal('value_num / value_denom')), 'balance']],
        raw: true,
      })
      console.log(accBalance)
      return accBalance[0].balance
      // const accBalances =  await models.splits.findAll({
      //   attributes: [[sequelize.fn('SUM', sequelize.col('value_num')), 'balance'], 'account_guid'],
      //   group: 'account_guid',
      //   raw: true,
      // })
      // // console.log(accBalances)
      // return accBalances.reduce((a,c) => {
      //   if (c.account_guid == account.guid) {
      //     a = c.balance
      //     return a
      //   } return a
      // },)
    },
    async commodity (account) {
      return account.getCommodity()
    },
    async splits (account) {
      return account.getSplits()
    },
    async children (account, {guid}, {models}) {
      const childr = await models.accounts.findAll({
        where: {
          parent_guid: account.guid
        }
      })
      return childr
    },
    async parent (account, {guid}, {models}) {
      return models.accounts.findByPk(account.parent_guid)
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