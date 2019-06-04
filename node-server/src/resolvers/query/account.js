const accountResolver = {
  Query: {
    async account (root, {guid}, {knex}) {
      // const acc = await knex('accounts').select().where({guid})
      const account = await knex.withRecursive('ancestors', (qb) => {
        qb.select('accounts.*', knex.raw('0 as depth'), knex.raw('accounts.name as fullname'))
        .from('accounts')
        .where('parent_guid', 'fd4dd79886327b270a0fa8efe6a07972')
        .unionAll((qb) => {
          qb.select('accounts.*', knex.raw('ancestors.depth + 1 as depth'), knex.raw('ancestors.fullname || ? || accounts.name',[":"]))
          .from('accounts')
          .join('ancestors','ancestors.guid','accounts.parent_guid')
        })
      }).select().from('ancestors').where('guid', guid)
      return account[0]
    }
  }
}

module.exports = {
 accountResolver 
}