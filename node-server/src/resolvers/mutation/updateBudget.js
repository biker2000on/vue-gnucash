const updateBudgetResolver = {
  Mutation: {
    async updateBudget(root, args, {
      knex
    }) {
      const budget = args.budget
      await knex('budgets').update(budget).where('guid', budget.guid)
      const budg = await knex('budgets').select().where('guid', budget.guid)
      return budg[0]
    }
  }
}

module.exports = {
  updateBudgetResolver
}