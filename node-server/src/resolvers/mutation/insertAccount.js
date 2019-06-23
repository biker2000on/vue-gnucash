const uuidv4 = require('uuid/v4')

const insertAccountResolver = {
  Mutation: {
    async insertAccount(root, args, {
      knex
    }) {
      const account = args.account
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