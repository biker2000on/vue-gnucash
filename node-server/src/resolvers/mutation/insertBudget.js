const uuidv4 = require('uuid/v4')

const insertBudgetResolver = {
  Mutation: {
    async insertBudget(root, args, {
      knex
    }) {
      const budget = args.budget
      const budgetGuid = uuidv4().replace(/-/g, '')
      budget['guid'] = budgetGuid
      await knex('budgets').insert(budget)
      const budg = await knex('budgets').select().where('guid', budgetGuid)
      return budg[0]
    }
  }
}

module.exports = {
  insertBudgetResolver
}