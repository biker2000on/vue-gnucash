const balancesResolver = {
  Query: {
    async balances (root, args, {knex}) {
      const balances = await knex('splits').groupBy('account_guid')
        .sum({value: knex.raw('?? / ??', ['value_num','value_denom'])})
        .sum({quantity: knex.raw('?? / ??',['quantity_num','quantity_denom'])})
        .sum({balance: knex.raw('?? / ??',['quantity_num','quantity_denom'])})
        .select('account_guid')
      return balances
    }
  }
}

module.exports = {
  balancesResolver  
}