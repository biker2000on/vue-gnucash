const deleteAccountResolver = {
  Mutation: {
    async deleteAccount(root, args, {
      knex
    }) {
      return await knex('accounts').where('guid', args.guid).del()
    }
  }
}

module.exports = {
  deleteAccountResolver
}