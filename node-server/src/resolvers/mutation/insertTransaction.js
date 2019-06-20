const uuidv4 = require('uuid/v4')
const moment = require('moment')

const insertTransactionResolver = {
  Mutation: {
    async insertTransaction (root, args, {knex}) {
      const transGuid = uuidv4().replace(/-/g,'')
      // Using trx as a query builder:
      knex.transaction(function(trx) {
        const splits = args.account_guids.map((c,i) => {
          return {
            guid: uuidv4().replace(/-/g,''),
            account_guid: c,
            value_num: args.values[i] * 100,
            quantity_num: args.quantities ? args.quantities[i] * 100 : args.values[i] * 100,
            value_denom: 100,
            quantity_denom: 100,
            tx_guid: transGuid,
            reconcile_state: "n", // not reconciled on creation
            reconcile_date: "1970-01-01 00:00:00", // default reconcile date
            memo: args.memos ? args.memos[i] : '',
            action: args.actions ? args.actions[i] : '', // [Buy, Increase, Decrease, Sell] possible options
          }
        })

        const transaction = {
          guid: transGuid, 
          description: args.description, 
          post_date: moment(args.post_date).format('YYYY-MM-DD kk:mm:ss'), // yyyy-mm-dd hh:mm:ss kk is 24 hours
          enter_date: moment().format('YYYY-MM-DD kk:mm:ss'),
          currency_guid: "6bb5a4a2b2390043f8517de6cff31f5f", // USD GUID hardcoded
          num: "", // default is "" Text(2048)
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
    }
  }
}

module.exports = {
  insertTransactionResolver  
}