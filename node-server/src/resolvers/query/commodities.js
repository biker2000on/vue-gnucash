const commoditiesResolver = {
  Query: {
    async commodities (root, args, {knex}) {
      return knex('commodities').select()
    },
  }
}

module.exports = {
  commoditiesResolver
}