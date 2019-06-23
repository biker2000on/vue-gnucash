const moment = require('moment')

const transactionResolver = {
  Mutation: {
    async updateTransaction(root, args, {
      knex
    }) {
      console.log(args)
      if (args.splits) {
        const splitSum = args.splits.reduce((a,c) => {
          a.value += c.value
          return a
        },{quantity: 0, value: 0})
        if (splitSum.value != 0) {  // return error validation value to GraphQL
          console.log("Sum not equal to 0")
          return
        }
        const splits = args.splits.map((c, i) => {
          let obj = {
            guid: c.guid,
            account_guid: c.account_guid,
            value_num: c.value * 100, // assumes 100 is the correct base
            quantity_num: c.quantity ? c.quantity * 100 : c.value * 100,
            tx_guid: args.guid,
          }
          // value_denom: 100,
          // quantity_denom: 100,
          if (c.reconcile_state) obj['reconcile_state'] = c.reconcile_state // not reconciled on creation
          if (c.reconcile_date) obj['reconcile_date'] = c.reconcile_date // default reconcile date
          if (c.memo) obj['memo'] = c.memo
          if (c.action) obj['action'] = c.action // [Buy, Increase, Decrease, Sell] Actions enum
          return obj
        })


        let retVal = await knex.transaction(async (trx) => {
          // for (let rate of Object.keys(rate)) {
          //   let value = rate[key];
          //   await trx('currency_exchange_rates')
          //   .update({ rate: value }).where('currency', key);
          // }
          for (let split of splits) {
            await trx('splits').update(split).where('guid', split.guid)
          }
          return "woo done"; // this value is returned from transaction 
        });

      }

      const transaction = {}
      transaction['enter_date'] = moment().format('YYYY-MM-DD kk:mm:ss')
      if (args.description) transaction['description'] = args.description
      if (args.post_date) transaction['post_date'] = moment(args.post_date).format('YYYY-MM-DD kk:mm:ss') // yyyy-mm-dd hh:mm:ss kk is 24 hours
      if (args.num) transaction['num'] = args.num // default is "" Text(2048)
      if (args.currency_guid) transaction['currency_guid'] = args.currency_guid

      const update = await knex('transactions').where('guid', args.guid).update(transaction)
      // console.log("update", update) // returns number of rows updated

      const trans = await knex('transactions').select().where('guid', args.guid)
      return trans[0]
    }
  }
}

module.exports = {
  transactionResolver
}