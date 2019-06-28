const insertBudgetAmountsResolver = {
  Mutation: {
    async insertBudgetAmounts(root, args, {knex}) {
      let budgetAmounts = args.amounts
      budgetAmounts = budgetAmounts.map(c => {
        c['budget_guid'] = args.budget_guid
        return c
      })
      await knex('budget_amounts').insert(budgetAmounts)
      const ba = await knex('budget_amounts')
        .select()
        .where('budget_guid', args.budget_guid)
        .limit(budgetAmounts.length)
        .orderBy('id', 'DESC')
      return ba
    }
  }
}

module.exports = {
  insertBudgetAmountsResolver
}