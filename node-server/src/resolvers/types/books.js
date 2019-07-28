const booksResolver = {
  Book: {
    async root_account (book, args, {knex}) {
      const root = await knex('accounts')
        .where('guid', book.root_account_guid)
        .select()
      return root[0]
    }
  }
}

module.exports = {
  booksResolver
}