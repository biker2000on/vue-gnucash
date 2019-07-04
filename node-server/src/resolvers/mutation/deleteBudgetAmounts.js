const deleteBudgetAmountsResolver = {
  Mutation: {
    async deleteBudgetAmounts(root, args, {knex}) {
      await knex('budget_amounts').whereIn('id',args.id).del()
      return args.id.length
      
    }
  }
}

module.exports = {
  deleteBudgetAmountsResolver
}