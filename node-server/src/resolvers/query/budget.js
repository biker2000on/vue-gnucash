const budgetResolver = {
  Query: {
    async budget (root, {guid}, {knex}) {
      // const acc = await knex('accounts').select().where({guid})
      const budget = await knex('budgets')
        .join('recurrences','budgets.guid','recurrences.obj_guid')
        .where('guid', guid)
        .select()
      return budget[0]
    },
    async budgets (root, args, {knex}) {
      const budgets = await knex('budgets')
      .join('recurrences','budgets.guid','recurrences.obj_guid')
      .select()
      return budgets
    }
  }
}

module.exports = {
 budgetResolver 
}