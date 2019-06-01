const sequelize = require('sequelize')
// const models = require('../models')

const resolvers = {
  Query: {
    async account (root, {guid}, {knex}) {
      const acc = await knex('accounts').select().where({guid})
      return acc[0]
    },
    async accounts (root, args, {knex}) {
      return knex.select().from('accounts')
    },
    async balances (root, args, {knex}) {
      const balances = await knex('splits').groupBy('account_guid')
        .sum({value: knex.raw('?? / ??', ['value_num','value_denom'])})
        .sum({quantity: knex.raw('?? / ??',['quantity_num','quantity_denom'])})
        .sum({balance: knex.raw('?? / ??',['quantity_num','quantity_denom'])})
        .select('account_guid')
      console.log(balances)
      return balances
    }
  },
  Account: {
    async balance (account, args, {knex}) {
      const accBalance =  await knex('splits').where('account_guid', account.guid)
      .sum({value: knex.raw('?? / ??', ['value_num','value_denom'])})
      .sum({quantity: knex.raw('?? / ??',['quantity_num','quantity_denom'])})
      .sum({balance: knex.raw('?? / ??',['quantity_num','quantity_denom'])})
      .select('account_guid')
      return accBalance[0]
    },
    async commodity (account, args, {knex}) {
      const commodity = await knex('commodities').where('guid', account.commodity_guid).select()
      return commodity[0]
    },
    async splits (account, args, {knex}) {
      const splits = await knex('splits').where('account_guid', account.guid).select()
      return splits
    },
    async transactions (account, args, {knex}) {
      const txs = await knex('splits').where('splits.account_guid', account.guid)
                          .join('transactions as t','splits.tx_guid','t.guid')
                          .select('t.guid','t.currency_guid','t.num','t.post_date','t.enter_date','t.description')
                          .limit(undefined)
      console.log(txs)
      return txs
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