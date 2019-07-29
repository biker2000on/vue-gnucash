
<template>
  <v-navigation-drawer app :value="drawer" @input="$emit('update:drawer',$event)">
    <v-list>
      <v-list-tile @click="$emit('home-click',$event)">
        <v-list-tile-action>
          <v-icon color="primary">home</v-icon>
        </v-list-tile-action>
        <v-list-tile-title>Home</v-list-tile-title>
      </v-list-tile>
      <v-list-group prepend-icon="settings" :value="false">
        <template v-slot:activator>
          <v-list-tile>
            <v-list-tile-title>Settings</v-list-tile-title>
          </v-list-tile>
        </template>
        <v-list-tile @click="openTransactionSettings">
          <v-list-tile-action>
            <v-icon>settings</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Transaction Journal</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="openViewableSettings">
          <v-list-tile-action>
            <v-icon>settings</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Accounts Filter</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="openBudgetSettings">
          <v-list-tile-action>
            <v-icon>settings</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Budget</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="openReportSettings">
          <v-list-tile-action>
            <v-icon>settings</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Report</v-list-tile-title>
        </v-list-tile>
      </v-list-group>
      <v-list-group prepend-icon="attach_money" @click.stop :value="false">
        <template v-slot:activator>
          <v-list-tile>
        <v-list-tile-title>Budget</v-list-tile-title>
        </v-list-tile>
        </template>
        <v-list-tile v-for="budget in budgets" :key="budget.guid" @click="$emit('update-budget',budget.guid)">
          <v-list-tile-title>{{ budget.name }}</v-list-tile-title>
        </v-list-tile>
      </v-list-group>
      <v-list-tile @click.stop>
        <v-list-tile-action>
          <v-icon>timeline</v-icon>
        </v-list-tile-action>
        <v-list-tile-title>Reports</v-list-tile-title>
      </v-list-tile>

      <v-list-group prepend-icon="account_balance" :value="true">
        <template v-slot:activator>
          <v-list-tile>
            <v-list-tile-title>Accounts</v-list-tile-title>
          </v-list-tile>
        </template>
        <v-sheet class="pa-3 primary">
          <v-text-field
            v-model="search"
            label="Search Account Tree"
            dark
            flat
            solo-inverted
            hide-details
            clearable
            clear-icon="mdi-close-circle-outline"
          ></v-text-field>
        </v-sheet>
        <!-- <v-progress-circular v-if="$apollo.queries.accountTree.loading" indeterminate /> -->
        <v-treeview
          :items="accountTree"
          :search="search"
          activatable
          hoverable
          item-key="guid"
          @update:active="$emit('update-account',$event)"
        />
      </v-list-group>
    </v-list>
    <account-settings :dialog.sync="accountSettingsDialog"/>
    <budget-settings :dialog.sync="budgetSettingsDialog"/>
    <report-settings :dialog.sync="reportSettingsDialog" :accountTree="accountTree" />
    <transaction-settings :dialog.sync="transactionSettingsDialog"/>
    <viewable-account-settings :dialog.sync="viewableSettingsDialog" />
  </v-navigation-drawer>
</template>

<script>
import AccountSettings from "./Settings/AccountSettings";
import BudgetSettings from "./Settings/BudgetSettings";
import ReportSettings from "./Settings/ReportSettings";
import TransactionSettings from "./Settings/TransactionSettings";
import ViewableAccountSettings from './Settings/ViewableAccountSettings'

export default {
  name: "Navigation",
  components: {
    AccountSettings,
    BudgetSettings,
    ReportSettings,
    TransactionSettings,
    ViewableAccountSettings
  },
  props: {
    accountTree: {
      type: Array,
      required: false
    },
    drawer: {
      type: Boolean,
      required: false,
      default: null
    },
    budgets: {
      type: Array,
      required: false
    }
  },
  data() {
    return {
      search: null,
      accountSettingsDialog: false,
      budgetSettingsDialog: false,
      reportSettingsDialog: false,
      transactionSettingsDialog: false,
      viewableSettingsDialog: false,
    };
  },
  methods: {
    updateAccount: e => {
      this.$emit("update-account", e);
    },
    updateDrawer(e) {
      console.log("input event", e);
      this.$emit("update-drawer", e);
    },
    openAccountSettings(e) {
      this.accountSettingsDialog = !this.accountSettingsDialog;
    },
    openBudgetSettings(e) {
      this.budgetSettingsDialog = !this.budgetSettingsDialog;
    },
    openReportSettings(e) {
      this.reportSettingsDialog = !this.reportSettingsDialog;
    },
    openTransactionSettings(e) {
      this.transactionSettingsDialog = !this.transactionSettingsDialog;
    },
    openViewableSettings(e) {
      this.viewableSettingsDialog = !this.viewableSettingsDialog
    }
  }
};
</script>

<style>
</style>
