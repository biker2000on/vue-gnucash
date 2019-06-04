const accountsResolver = {
  Query: {
    async accounts (root, args, {knex}) {
      return knex.withRecursive('ancestors', (qb) => {
        qb.select('accounts.*', knex.raw('0 as depth'), knex.raw('accounts.name as fullname'))
        .from('accounts')
        .where('parent_guid', 'fd4dd79886327b270a0fa8efe6a07972')
        .unionAll((qb) => {
          qb.select('accounts.*', knex.raw('ancestors.depth + 1 as depth'), knex.raw('ancestors.fullname || ? || accounts.name',[":"]))
          .from('accounts')
          .join('ancestors','ancestors.guid','accounts.parent_guid')
        })
      }).select().from('ancestors').orderBy('fullname')
    },
  }
}

module.exports = {
  accountsResolver
}