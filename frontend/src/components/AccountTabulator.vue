<template>
  <vue-tabulator
    v-if="!$apollo.queries.accounts.loading"
    v-model="transactionsTable"
    :options="options"
    ref="tabulator"
  />
</template>

<script>
import gql from "graphql-tag";
import moment from "moment";
import Dinero from "dinero.js";

Dinero.globalLocale = "en-US";

const TXTABLE = gql`
  query getAccounts($guid: String) {
    accounts(guid: $guid) {
      guid
      name
      transactions {
        guid
        post_date
        # enter_date
        description
        note
        splits {
          guid
          account_guid
          memo
          action
          reconcile_state
          reconcile_date
          value_num
          value_denom
          quantity_num
          quantity_denom
        }
      }
    }
  }
`;

const TRANSACTION_UPDATE = gql`
  mutation(
    $guid: String!
    $description: String
    $post_date: String
    $splits: [UpdateSplitInput]
  ) {
    updateTransaction(
      guid: $guid
      description: $description
      post_date: $post_date
      splits: $splits
    ) {
      guid
      note
      post_date
      enter_date
      description
      splits {
        guid
        account_guid
        quantity
        value
      }
    }
  }
`;

export default {
  props: {
    account_guid: {
      type: String,
      required: false
    },
    flataccounts: {
      type: Object,
      required: false,
      default: function() {
        return {};
      }
    },
    commodity: {
      type: String,
      required: false,
      default: "USD"
    },
    type_map: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data: () => ({
    error: [],
    widths: 20
  }),
  methods: {
    editHandler(e, p) {
      console.log("e", e);
      console.log("p", p);
      let splits = p.item.splits.map(c => {
        return {
          guid: c.guid,
          account_guid: c.account_guid,
          value: c.value,
          quantity: c.quantity
          // memo: c.memo,
          // action: c.action,
          // reconcile_state: c.reconcile_state,
          // reconcile_date: c.reconcile_date,
        };
      });
      this.$apollo.mutate({
        mutation: TRANSACTION_UPDATE,
        variables: {
          guid: p.item.guid,
          description: p.item.description,
          post_date: p.item.post_date,
          splits: splits
        },
        update: (store, { data: { updateTransaction } }) => {
          if (updateTransaction) {
            console.log("UPDATE TX", updateTransaction);
            const txt = store.readQuery({
              query: TXTABLE
            });
          }
        }
        // optimisticResponse: {
        //   __typename: 'Mutation',
        //   update_todos: {
        //     __typename: 'todos',
        //     id: todo.id,
        //     is_completed: !todo.is_completed,
        //     affected_rows: 1,
        //   }
        // }
      });
    }
  },
  computed: {
    transactionsTable() {
      const vm = this;

      // Dinero default
      Dinero.defaultAmount = 0;
      Dinero.defaultCurrency = vm.commodity;
      Dinero.defaultPrecision = 2;

      let txs = vm.accounts[0].transactions.map((c, index, arr) => {
        let accountSplit = c.splits.find(
          g => (g.account_guid == vm.account_guid)
        );
        let mainsplit = c.splits.reduce(
          (a, cur) => {
            if (
              vm.type_map[cur.account_guid].account_type != "TRADING" &&
              cur.account_guid != vm.account_guid
            ) {
              a.split = cur;
              a.i = a.i + 1;
              return a;
            }
            return a;
          },
          { i: 0 }
        );
        c.debit_value =
          accountSplit.value_num > 0
            ? Dinero({
                amount: accountSplit.quantity_num,
                precision: Math.log10(accountSplit.value_denom),
                currency: vm.commodity
              })
            : Dinero();
        c.credit_value =
          accountSplit.value_num < 0
            ? Dinero({
                amount: -accountSplit.quantity_num,
                precision: Math.log10(accountSplit.value_denom),
                currency: vm.commodity
              })
            : Dinero();
        c.account_guid = mainsplit.i == 1 ? mainsplit.split.account_guid : null;
        c["balance"] = // Dinero()
          index > 0
            ? arr[index - 1].balance.add(c.debit_value).subtract(c.credit_value)
            : c.debit_value.subtract(c.credit_value);
        return c;
      });
      return txs;
    },
    flataccountsNull() {
      const vm = this;
      return {
        ...vm.flataccounts,
        null: "--Split Transaction--"
      };
    },
    options() {
      const vm = this;
      return {
        columns: vm.columns,
        height: 550
      };
    },
    columns() {
      const vm = this;
      return [
        {
          title: "Date",
          field: "post_date",
          sorter: "string",
          width: 100,
          align: "left",
          editor: "input",
          formatter: function(cell, formatterParams, onRendered) {
            const date = moment(cell.getValue());
            return moment(cell.getValue()).format("L");
          },
          formatterParams: {
            outputFormat: "MM/DD/YYYY"
          }
        },
        {
          title: "Description",
          field: "description",
          sorter: "string",
          align: "left",
          editor: "input"
        },
        {
          title: "Account",
          field: "account_guid",
          sorter: "string",
          width: 300,
          align: "left",
          formatter: "lookup",
          formatterParams: vm.flataccountsNull,
          editor: "autocomplete",
          editorParams: {
            showListOnEmpty: true, //show all values when the list is empty,
            freetext: false, //allow the user to set the value of the cell to a free text entry
            allowEmpty: false, //allow empty string values
            values: vm.flataccounts //create list of values from all values contained in this column
          }
        },
        {
          title: "Debit",
          field: "debit_value",
          sorter: "number",
          width: 100,
          align: "right",
          formatter: function(cell, formatterParams, onRendered) {
            return cell.getValue().getAmount() != 0
              ? cell.getValue().toFormat("$0,0.00")
              : "";
          }
        },
        {
          title: "Credit",
          field: "credit_value",
          sorter: "number",
          width: 100,
          align: "right",
          formatter: function(cell, formatterParams, onRendered) {
            return cell.getValue().getAmount() != 0
              ? cell.getValue().toFormat("$0,0.00")
              : "";
          }
        },
        {
          title: "Balance",
          field: "balance",
          width: 100,
          align: "right",
          formatter: function(cell, formatterParams, onRendered) {
            return cell.getValue().getAmount() != 0
              ? cell.getValue().toFormat("$0,0.00")
              : "";
          }
        }
      ];
    },
  },
  mounted() {},
  apollo: {
    accounts: {
      query: TXTABLE,
      variables() {
        return {
          guid: this.account_guid
        };
      },
      update(data) {
        return data.accounts;
      },
      // result(queryResult) {
      //   // console.log("result this", this)
      //   const vm = this;

      //   // Dinero default
      //   Dinero.defaultAmount = 0;
      //   Dinero.defaultCurrency = vm.commodity;
      //   Dinero.defaultPrecision = 2;

      //   queryResult.data.accounts[0].transactions.reduce((a, c) => {
      //     console.log("transaction", c.description, c.post_date);
      //     let accountSplit = c.splits.find(
      //       c => (c.account_guid = vm.account_guid)
      //     );
      //     let mainsplit = c.splits.reduce(
      //       (a, cur) => {
      //         if (
      //           vm.type_map[cur.account_guid].account_type != "TRADING" &&
      //           cur.account_guid != vm.account_guid
      //         ) {
      //           console.log(
      //             "inside map",
      //             cur.account_guid == vm.account_guid,
      //             cur.value_num > 0 ? true : false
      //           );
      //           a.split = cur;
      //           a.i = a.i + 1;
      //           return a;
      //         }
      //         return a;
      //       },
      //       { i: 0 }
      //     );
      //     console.log("mainsplit", mainsplit, mainsplit.i);
      //     console.log("main account split", accountSplit);
      //     c.debit_value =
      //       accountSplit.value_num > 0
      //         ? Dinero({
      //             amount: accountSplit.value_num,
      //             precision: Math.log10(accountSplit.value_denom),
      //             currency: vm.commodity
      //           })
      //         : Dinero();
      //     c.credit_value =
      //       accountSplit.value_num < 0
      //         ? Dinero({
      //             amount: -accountSplit.value_num,
      //             precision: Math.log10(accountSplit.value_denom),
      //             currency: vm.commodity
      //           })
      //         : Dinero();
      //     c.account_guid =
      //       mainsplit.i == 1 ? mainsplit.split.account_guid : null;
      //     c["balance"] = a.add(c.debit_value).subtract(c.credit_value);
      //     a = c.balance;
      //     return a;
      //   }, Dinero());
      //   return queryResult;
      // }
    }
  }
};
</script>

<style lang="scss">
@import "../../node_modules/vue-tabulator/dist/scss/tabulator.scss";
</style>
