const accountResolver = {
  Query: {
    async account (root, {guid}, {knex}) {
      const acc = await knex('accounts').select().where({guid})
      return acc[0]
    }
  }
}

module.exports = {
 accountResolver 
}