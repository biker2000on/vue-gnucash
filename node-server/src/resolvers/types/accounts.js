const accountResolver = {
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
                          .select('t.*')
                          .limit(undefined)
      return txs
    },
    async children (account, args, {knex}) {
      const children = await knex('accounts').where('parent_guid', account.guid).select()
      return children
    },
    async parent (account, args, {knex}) {
      const parent = await knex('accounts').where('guid',account.parent_guid).select()
      return parent[0]
    },
  }
}

module.exports = {
 accountResolver 
}