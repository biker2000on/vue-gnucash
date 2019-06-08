const transactionsTableResolver = {
  Query: {
    async transactionsTable (root, {guid}, {knex}) {
      const balances = await knex('splits as x')
        .join('transactions as t','t.guid','x.tx_guid')
        .join('splits as s','t.guid','s.tx_guid')
        .join('accounts as a','a.guid','s.account_guid')
        .where('x.account_guid', guid)
        .groupBy('t.guid')
        .orderBy('t.post_date')
        .select(
          't.guid',
          't.currency_guid',
          knex.raw(`strftime('%Y/%m/%d',t.post_date) as post_date`),
          't.enter_date',
          't.description',
          knex.raw(
            `CASE WHEN x.value_num > 0 THEN CAST(x.value_num as real) / CAST(x.value_denom as REAL) WHEN x.value_num < 0 THEN NULL ELSE 0 END as debit_value`
          ),
          knex.raw(`CASE WHEN x.value_num > 0 THEN NULL WHEN x.value_num < 0 THEN CAST(ABS(x.value_num) as real) / CAST(x.value_denom as REAL) ELSE 0 END as credit_value`),
          knex.raw(`CASE WHEN x.quantity_num > 0 THEN CAST(x.quantity_num as real) / CAST(x.quantity_denom as REAL) WHEN x.quantity_num < 0 THEN NULL ELSE 0 END as debit_quantity`),
          knex.raw(`CASE WHEN x.quantity_num > 0 THEN NULL WHEN x.quantity_num < 0 THEN CAST(ABS(x.quantity_num) as real) / CAST(x.quantity_denom as REAL) ELSE 0 END as credit_quantity`),
          knex.raw(`max(CASE WHEN a.account_type != 'TRADING' AND s.account_guid != ? THEN a.guid ELSE NULL END) as account_guid`,[guid]),
          knex.raw(`json_group_array(json_object('account_guid', a.guid, 'debit_quantity', CASE WHEN s.quantity_num > 0 THEN CAST(s.quantity_num as real) / CAST(s.quantity_denom as REAL) WHEN s.quantity_num < 0 THEN NULL ELSE 0 END,'credit_quantity', CASE WHEN s.quantity_num > 0 THEN NULL WHEN s.quantity_num < 0 THEN CAST(ABS(s.quantity_num) as real) / CAST(s.quantity_denom as REAL) ELSE 0 END, 'debit_value', CASE WHEN s.value_num > 0 THEN CAST(s.value_num as real) / CAST(s.value_denom as REAL) WHEN s.value_num < 0 THEN NULL ELSE 0 END, 'credit_value', CASE WHEN s.value_num > 0 THEN NULL WHEN s.value_num < 0 THEN CAST(ABS(s.value_num) as real) / CAST(s.value_denom as REAL) ELSE 0 END)) as 'splits'`)
        )
      return balances
    }
  }
}

module.exports = {
  transactionsTableResolver  
}