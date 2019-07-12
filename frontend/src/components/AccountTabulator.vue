<template>
  <vue-tabulator 
    v-if="!$apollo.queries.accounts.loading"
    v-model="accounts[0].transactions"
    :options="options"
    ref="tabulator"
  />
</template>

<script>
import gql from "graphql-tag";
import getSymbolFromCurrency from "currency-symbol-map";
import moment from "moment";

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
          value
          quantity
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
    transactionsTable: [],
    error: [],
    widths: 20,
    
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
    options() {
      const vm = this
      return {
        columns: vm.columns
      }
    },
    columns() {
      const self = this
      return [
        {
          title: "Date",
          field: "post_date",
          sorter: 'string',
          width: 100,
          align: 'left'
        },
        {
          title: "Description",
          field: 'description',
          sorter: 'string',
          align: 'left'
        },
        {
          title: "Account",
          field: 'account_guid',
          sorter: 'string',
          width: 300,
          align: 'left',
          formatter: 'lookup',
          formatterParams: self.flataccounts
        },
        {
          title: "Debit",
          field: 'debit_value',
          sorter: 'number',
          width: 100,
          align: 'right'
        },
        {
          title: "Credit",
          field: 'credit_value',
          sorter: 'number',
          width: 100,
          align: 'right',
        },
        {
          title: 'Balance',
          field: 'balance',
          width: 100,
          align: 'right'
        },
      ]
    },
    symbol() {
      const symbol = getSymbolFromCurrency(this.commodity);
      return symbol ? symbol : this.commodity;
    }
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
      result(queryResult) {
        // console.log("result this", this)
        const self = this;
        console.log("TXTABLE", queryResult);
        queryResult.data.accounts[0].transactions.reduce((a, c) => {
          let mainsplit = c.splits.reduce(
            (a, cur) => {
              if (
                cur.account_type != "TRADING" &&
                cur.account_guid != self.account_guid
              ) {
                a.split = cur;
                a.i = a.i + 1;
                return a;
              }
              return a;
            },
            { i: 0 }
          );
          console.log("mainsplit", mainsplit, mainsplit.i);
          let accountSplit = c.splits.find(
            c => (c.account_guid = self.account_guid)
          );
          c.debit_value = accountSplit.value > 0 ? accountSplit.value : null;
          c.credit_value = accountSplit.value < 0 ? -accountSplit.value : null;
          c.account_guid =
            mainsplit.i == 1 ? mainsplit.split.account_guid : null;
          c["balance"] = a + c.debit_value - c.credit_value;
          a = c.balance;
          return a;
        }, 0);
        return queryResult;
      }
    }
  }
};
</script>

<style lang="scss">
@import "../../node_modules/vue-tabulator/dist/scss/tabulator.scss";
</style>
