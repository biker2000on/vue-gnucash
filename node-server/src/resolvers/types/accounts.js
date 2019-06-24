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
                          .leftJoin('slots as s', 's.obj_guid', 't.guid')
                          .where('s.name',"notes")
                          .select('t.*','s.string_val as note')
      return txs
    },
    async transactionSplits (account, args, {knex}) {
      const txSplits = knex('splits').join('transactions as t','splits.tx_guid','t.guid')
                        .join('splits as s','s.tx_guid','t.guid')
                        .where('splits.account_guid', account.guid)
                        .groupBy('t.guid')
                        .orderBy('t.post_date')
                        .select('t.*', knex.raw("json_group_array(json_object('account_guid',s.account_guid,'value_num',s.value_num, 'value_denom', s.value_denom, 'quantity_num', s.quantity_num, 'quantity_denom', s.quantity_denom)) as 'splits'"))
      return txSplits
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