const uuidv4 = require('uuid/v4')

const insertTransactionResolver = {
  Mutation: {
    async insertTransaction (root, args, {knex}) {
      // console.log("root", root)
      const transGuid = uuidv4().replace(/-/g,'')
      // Using trx as a query builder:
      knex.transaction(function(trx) {
        const splits = [
          {
            guid: uuidv4().replace(/-/g,''),
            account_guid: args.from_account_guid,
            value_num: args.from_value * 100,
            quantity_num: args.from_value * 100,
            value_denom: 100,
            quantity_denom: 100,
            tx_guid: transGuid,
            reconcile_state: "n",
            reconcile_date: "1970-01-01 00:00:00",
            memo: "",
            action: "",
          },
          {
            guid: uuidv4().replace(/-/g,''),
            account_guid: args.to_account_guid,
            value_num: args.to_value * 100,
            quantity_num: args.to_value * 100,
            value_denom: 100,
            quantity_denom: 100,
            tx_guid: transGuid,
            reconcile_state: "n",
            reconcile_date: "1970-01-01 00:00:00",
            memo: "",
            action: "",
          }
        ]

        const transaction = {
          guid: transGuid, 
          description: args.description, 
          post_date: args.post_date, 
          enter_date: new Date().toISOString(),
          currency_guid: "6bb5a4a2b2390043f8517de6cff31f5f", // USD GUID hardcoded
          num: 0, // need to look up default
        }

        return trx
          .insert(transaction)
          .into('transactions')
          .then(function() {
            return trx('splits').insert(splits);
            });
      })
      .then(function(inserts) {
        console.log(inserts);
      })
      .catch(function(error) {
        // If we get here, that means that neither the 'Old Books' catalogues insert,
        // nor any of the books inserts will have taken place.
        console.error(error);
      });
      // console.log("args", args)
      // console.log('uuid', uuidv4().replace(/-/g,''))
      // const insert = await knex('transactions').where('guid',args.guid).update({...args, enter_date: new Date().toISOString()})
      // console.log("update", update) // returns number of rows updated
      const transaction = await knex('transactions').select().where('guid',transGuid)
      return transaction[0]
    },
    async insertTransactionSplits (root, args, {knex}) {
      return
    }
  }
}

module.exports = {
  insertTransactionResolver  
}