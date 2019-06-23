const booksResolver = {
  Query: {
    async books (root, args, {knex}) {
      const books = await knex('books').select()
      return books
    }
  }
}

module.exports = {
  booksResolver  
}