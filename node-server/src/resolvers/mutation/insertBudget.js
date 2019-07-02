const uuidv4 = require('uuid/v4')

const insertBudgetResolver = {
  Mutation: {
    async insertBudget(root, args, {
      knex
    }) {
      const budget = {}, recur = {} 
      const budgetGuid = uuidv4().replace(/-/g, '')

      budget['guid'] = budgetGuid
      budget.name = args.budget.name
      budget.description = args.budget.description
      budget.num_periods = args.budget.num_periods

      recur.obj_guid = budgetGuid
      recur.recurrence_mult = args.budget.recurrence_mult
      recur.recurrence_period_type = args.budget.recurrence_period_type
      recur.recurrence_period_start = args.budget.recurrence_period_start
      recur.recurrence_weekend_adjust = args.budget.recurrence_weekend_adjust

      await knex('budgets').insert(budget)
      await knex('recurrences').insert(recur)
      const budg = await knex('budgets')
        .select()
        .join('recurrences', 'recurrences.obj_guid', 'budgets.guid')
        .where('budgets.guid', budgetGuid)
      return budg[0]
    }
  }
}

module.exports = {
  insertBudgetResolver
}