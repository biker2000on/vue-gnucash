<template>
  <slim-grid
    v-if="flataccounts"
    pk="guid"
    :data="accounts[0].transactions"
    :column-options="columnOptions"
    :height="550"
    :selection-model="selectionModel"
    :custom-plugins="customPlugins"
    forceFitColumns
    fullWidthRows
    editable
    enableAddRow
    leaveSpaceForNewRows
    :downloadable="false"
    @cell-change="editHandler"
    ref="slimgridComp"
  />
</template>

<script>
import gql from "graphql-tag";
import SlimGrid from "vue-slimgrid";
import getSymbolFromCurrency from "currency-symbol-map";
import moment from "moment";
import { Editors, Plugins, Row } from "slickgrid-es6";
import {RowDetailView} from "../assets/js/plugins/slick.rowdetailview";

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

const options = {
  forceFitColumns: true
};

export default {
  components: {
    SlimGrid
  },
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
    options: options,
    selectionModel: new Plugins.RowSelectionModel()
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
    customPlugins: function() {
      const self = this;
      return {
        RowDetailView: {
          register: true,
          plugin: new RowDetailView({
            cssClass: "detailView-toggle",
            preTemplate: function(itemDetail) {
              // basic template
              return Vue.component('loading', VProgressCircular)
            },
            postTemplate: function(itemDetail) {
              // add Vue component here
              return Vue.component('detail', {
                render: function(createElement) {
                  return createElement(SlimGrid, {
                    props: {
                      data: itemDetail.splits
                    }
                  })
                }
              })
            },
            useRowClick: true,
            // how many grid rows do we want to use for the detail panel
            // also note that the detail view adds an extra 1 row for padding purposes
            // example, if you choosed 6 panelRows, the display will in fact use 5 rows
            panelRows: 6,
            // make only every 2nd row an expandable row,
            // by using the override function to provide custom logic of which row is expandable
            // you can override it here in the options or externally by calling the method on the plugin instance
          }),
          // events: {
          //   onBeforeRowDetailToggle: {
          //     on(e, args) {
          //       self.$emit("before-row-detail-toggle", e, args);
          //     }
          //   },
          //   onAfterRowDetailToggle: {
          //     on(e, args) {
          //       self.$emit("after-row-detail-toggle", e, args);
          //     }
          //   }
          // }
        }
      };
    },
    columnOptions() {
      console.log("editor: ", Editors);
      const self = this;
      return {
        "*": {
          editor: Editors.Text
          // all column / default options
        },
        post_date: {
          name: "Date",
          width: 80,
          order: 1,
          formatter: function(row, cell, value) {
            return moment(value).format("L");
          }
        },
        description: {
          name: "Description",
          cssClass: "text-left",
          order: 2,
          minWidth: 100
          // editor: Editors.Text
        },
        account_guid: {
          name: "Account",
          cssClass: "text-left",
          width: 300,
          formatter: function(row, cell, value, columnDef, dataContext) {
            return value ? self.flataccounts[value] : "--Split Transaction--";
          },
          order: 3
        },
        debit_value: {
          name: "Debit",
          width: 80,
          order: 4
          // editor: Editors.Number
        },
        credit_value: {
          name: "Credit",
          width: 80,
          order: 5
        },
        balance: {
          name: "Balance",
          width: 100,
          order: 6
        },
        splits: {
          columns: [
            {
              id: "debit_value",
              name: "Debit",
              width: 100
            },
            {
              id: "credit_value",
              name: "Credit",
              width: 100
            },
            {
              id: "account_guid",
              name: "Account",
              width: 200
            }
          ],
          hidden: true
        },
        __typename: { hidden: true },
        debit_quantity: { hidden: true },
        credit_quantity: { hidden: true }
      };
    },
    symbol() {
      const symbol = getSymbolFromCurrency(this.commodity);
      return symbol ? symbol : this.commodity;
    }
  },
  mounted() {},
  apollo: {
    // transactionsTable: {
    //   query: TXTABLE,
    //   variables() {
    //     return {
    //       guid: this.account_guid
    //     };
    //   },
    //   update(data) {
    //     console.log("updating: ", data);
    //     return data.transactionsTable;
    //   },
    //   result(queryResult) {
    //     console.log("result");
    //     queryResult.data.transactionsTable.reduce((a, c, i) => {
    //       // if (c.account_guid) {
    //       //   try {
    //       //     c.account_guid = this.flataccounts[c.account_guid].fullname;
    //       //   } catch {}
    //       // }
    //       c["balance"] = a + c.debit_quantity - c.credit_quantity;
    //       a = c.balance;
    //       try {
    //         c.splits = JSON.parse(c.splits);
    //       } catch {}
    //       return a;
    //     }, 0);
    //     return queryResult;
    //     // console.log(queryResult)
    //   },
    //   // skip() {
    //   //   return Boolean(this.account_guid)
    //   // },
    //   error(error) {
    //     this.error.push(JSON.stringify(error.message));
    //   }
    // },
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

<style>
@import "../../node_modules/vue-slimgrid/dist/slimgrid.css";
@import "../assets/scss/rowdetailview.css";
</style>



