const accountsResolver = {
  Query: {
    async accounts (root, args, {knex}) {
      return knex('accounts').select()
    },
  }
}

module.exports = {
  accountsResolver
}