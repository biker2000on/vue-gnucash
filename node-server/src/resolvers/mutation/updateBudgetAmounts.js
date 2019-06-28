const updateBudgetAmountsResolver = {
  Mutation: {
    async updateBudgetAmounts(root, args, {knex}) {
      let budgetAmounts = args.amounts
      budgetAmounts = budgetAmounts.map(c => {
        c['budget_guid'] = args.budget_guid
        return c
      })
      console.log(budgetAmounts)
      for (let amount of budgetAmounts) {
        await knex('budget_amounts').update(amount).where('id', amount.id)
      }
      const ba = await knex('budget_amounts')
        .select()
        .whereIn('id', budgetAmounts.map(c => c.id))
      return ba
    }
  }
}

module.exports = {
  updateBudgetAmountsResolver
}