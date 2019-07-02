const updateBudgetResolver = {
  Mutation: {
    async updateBudget(root, args, {
      knex
    }) {
      const budget = {}, recur = {} 

      //may not work because of optional arguments
      budget.name = args.budget.name
      budget.description = args.budget.description
      budget.num_periods = args.budget.num_periods

      recur.recurrence_mult = args.budget.recurrence_mult
      recur.recurrence_period_type = args.budget.recurrence_period_type
      recur.recurrence_period_start = args.budget.recurrence_period_start
      recur.recurrence_weekend_adjust = args.budget.recurrence_weekend_adjust
      console.log('budget', budget)
      console.log('recur',recur)
      console.log('recur truth', Boolean(recur))
      if (budget) await knex('budgets').update(budget).where('guid', args.budget.guid)
      if (recur) await knex('recurrences').update(recur).where('obj_guid', args.budget.guid)
      const budg = await knex('budgets')
        .select()
        .join('recurrences', 'recurrences.obj_guid', 'budgets.guid')
        .where('budgets.guid', args.budget.guid)
      return budg[0]
    }
  }
}

module.exports = {
  updateBudgetResolver
}