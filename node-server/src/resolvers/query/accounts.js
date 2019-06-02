const accountsResolver = {
  Query: {
    async accounts (root, args, {knex}) {
      // return knex('accounts').select()
      return knex.withRecursive('ancestors', (qb) => {
        qb.select('accounts.*', knex.raw('0 as depth')).from('accounts').where('guid', 'fd4dd79886327b270a0fa8efe6a07972').unionAll((qb) => {
          qb.select('accounts.*', knex.raw('ancestors.depth + 1 as depth')).from('accounts').join('ancestors','ancestors.guid','accounts.parent_guid')
        })
      }).select().from('ancestors')
    },
  }
}

module.exports = {
  accountsResolver
}