const budgetResolver = {
  Query: {
    async budget (root, {guid}, {knex}) {
      // const acc = await knex('accounts').select().where({guid})
      const budget = await knex('budgets').select().where('guid', guid)
      return budget[0]
    },
    async budgets (root, args, {knex}) {
      const budgets = await knex('budgets').select()
      return budgets
    }
  }
}

module.exports = {
 budgetResolver 
}