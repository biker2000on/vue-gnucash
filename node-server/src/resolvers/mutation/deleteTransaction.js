const deleteTransactionResolver = {
  Mutation: {
    async deleteTransaction(root, args, {
      knex
    }) {
      try {
        const trx = await knex.transaction()
        await trx('transactions').where('guid',args.guid).del()
        await trx('splits').where('tx_guid',args.guid).del()
        trx.commit()
        return 1
      } catch (error) {
        console.warn(error)
      }
    }
  }
}

module.exports = {
  deleteTransactionResolver
}