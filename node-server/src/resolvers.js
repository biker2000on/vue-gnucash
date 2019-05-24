const resolvers = {
  Query: {
    async account (root, {guid}, {models}) {
      return models.accounts.findByPk(guid)
    },
    async accounts (root, args, {models}) {
      return models.accounts.findAll()
    },
  },
}

module.exports = resolvers