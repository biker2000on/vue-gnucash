const uuidv4 = require('uuid/v4')

const insertAccountResolver = {
  Mutation: {
    async insertAccount(root, args, {
      knex
    }) {
      const account = args.account
      account.commodity_guid = "6bb5a4a2b2390043f8517de6cff31f5f"
      account.commodity_scu = 100
      account.non_std_scu = 0
      const accountGuid = uuidv4().replace(/-/g, '')
      account['guid'] = accountGuid
      await knex('accounts').insert(account)
      const acc = await knex('accounts').select().where('guid', accountGuid)
      return acc[0]
    }
  }
}

module.exports = {
  insertAccountResolver
}