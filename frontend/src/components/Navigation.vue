
<template>
  <v-navigation-drawer app :value="drawer" @input="$emit('update:drawer',$event)">
    <v-list>
      <v-list-tile>
        <v-list-tile-action>
          <v-icon color="primary">home</v-icon>
        </v-list-tile-action>
        <v-list-tile-title>Home</v-list-tile-title>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-action>
          <v-icon>attach_money</v-icon>
        </v-list-tile-action>
        <v-list-tile-title>Budget</v-list-tile-title>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-action>
          <v-icon>timeline</v-icon>
        </v-list-tile-action>
        <v-list-tile-title>Reports</v-list-tile-title>
      </v-list-tile>

      <v-list-group prepend-icon="account_balance" value="true">
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
          return-object
        />
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "Navigation",
  props: {
    accountTree: {
      type: Array,
      required: false
    },
    drawer: {
      type: Boolean,
      required: false,
      default: null
    }
  },
  data() {
    return {
      search: null
    };
  },
  methods: {
    updateAccount: e => {
      this.$emit("update-account", e);
    },
    updateDrawer(e) {
      console.log("input event", e)
      this.$emit("update-drawer",e)
    },
  }
};
</script>

<style>
</style>
