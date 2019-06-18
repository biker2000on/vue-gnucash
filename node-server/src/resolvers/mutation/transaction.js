const uuidv4 = require('uuid/v4')

const transactionResolver = {
  Mutation: {
    async transaction (root, args, {knex}) {
      console.log("root", root)
      console.log("args", args)
      console.log('uuid', uuidv4().replace(/-/g,''))
      const update = await knex('transactions').where('guid',args.guid).update({...args, enter_date: new Date().toISOString()})
      console.log("update", update) // returns number of rows updated
      const transaction = await knex('transactions').select().where('guid',args.guid)
      return transaction[0]
    }
  }
}

module.exports = {
  transactionResolver  
}