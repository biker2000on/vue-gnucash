const deleteBudgetResolver = {
  Mutation: {
    async deleteBudget(root, args, {
      knex
    }) {
      const trx = await knex.transaction()
      await trx('budgets').del().where('guid', args.guid)
      await trx('recurrences').del().where('obj_guid', args.guid)
      await trx.commit()
      console.log('deleted',args.guid)
      return 1
    }
  }
}

module.exports = {
  deleteBudgetResolver
}