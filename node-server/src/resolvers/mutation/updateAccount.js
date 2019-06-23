const updateAccountResolver = {
  Mutation: {
    async updateAccount(root, args, {
      knex
    }) {
      const account = args.account
      await knex('accounts').update(account).where('guid', args.account.guid)
      const acc = await knex('accounts').select().where('guid', args.account.guid)
      return acc[0]
    }
  }
}

module.exports = {
  updateAccountResolver
}