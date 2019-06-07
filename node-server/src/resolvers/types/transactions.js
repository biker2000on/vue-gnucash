const txResolver = {
  Transaction: {
    async splits (tx, args, {knex}) {
      return knex.select('splits.*').from('splits').where('tx_guid', tx.guid)
    }
  }
}

module.exports = {
  txResolver
}