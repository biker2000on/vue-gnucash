<template>
  <div>
    <account-settings :dialog.sync="accountSettingsDialog"/>
    <budget-settings :dialog.sync="budgetSettingsDialog"/>
    <report-settings :dialog.sync="reportSettingsDialog"/>
    <transaction-settings :dialog.sync="transactionSettingsDialog"/>
  </div>
</template>

<script>
import AccountSettings from "./AccountSettings";
import BudgetSettings from "./BudgetSettings";
import ReportSettings from "./ReportSettings";
import TransactionSettings from "./TransactionSettings";

export default {
  component: {
    AccountSettings,
    BudgetSettings,
    ReportSettings,
    TransactionSettings
  },
  data: () => ({
    accountSettingsDialog: false,
    budgetSettingsDialog: false,
    reportSettingsDialog: false,
    transactionSettingsDialog: false,
  })
};
</script>


