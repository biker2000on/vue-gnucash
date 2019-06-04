const { makeTree, list_to_tree } = require('../../utilities/makeTree')

const accountTreeResolver = {
  Query: {
    async accountTree (root, args, {knex}) {
      const flatAccounts = await knex.withRecursive('ancestors', (qb) => {
        qb.select('accounts.*', knex.raw('0 as depth'),knex.raw('name as fullname')).from('accounts')
        .where('parent_guid', 'fd4dd79886327b270a0fa8efe6a07972')
        .unionAll((qb) => {
          qb.select('accounts.*', knex.raw('ancestors.depth + 1 as depth'), knex.raw('ancestors.fullname || ? || accounts.name',[':']))
          .from('accounts')
          .join('ancestors','ancestors.guid','accounts.parent_guid')
        })
      }).select().from('ancestors').orderBy('ancestors.fullname')
      const tree = makeTree(flatAccounts, "guid", "parent_guid", 'children', 'fd4dd79886327b270a0fa8efe6a07972')
      // const tree = list_to_tree(flatAccounts, "guid",'parent_guid', 'fd4dd79886327b270a0fa8efe6a07972')
      return tree
    }
  }
}

module.exports = {
  accountTreeResolver
}