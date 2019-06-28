const budgetResolver = {
  Budget: {
    async budget_amounts (budget, args, {knex}) {
      const budgetAmounts = await knex('budget_amounts')
        .where('budget_guid',budget.guid)
        .select('*',knex.raw('amount_num / amount_denom as amount'))
      return budgetAmounts
    }
  },
  BudgetAmounts: {
    async account (budgetAmount, args, {knex}) {
      const account = await knex('accounts')
        .where('guid',budgetAmount.account_guid)
        .select()
      return account[0]
    }
  }
}

module.exports = {
 budgetResolver 
}

