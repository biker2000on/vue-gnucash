const txResolver = {
  Transaction: {
    async splits (tx, args, {knex}) {
      return knex.select('splits.*').from('splits').where('tx_guid', tx.guid)
    },
    async notes (tx, args, {knex}) {
      return knex('slots')
        .select('string_val as notes')
        .where('obj_guid', tx.guid)
        .where('name', "notes")[0]
    }
  }
}

module.exports = {
  txResolver
}