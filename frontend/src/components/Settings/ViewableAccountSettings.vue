<template>
  <v-layout row justify-center>
    <v-dialog :value="dialog" @input="$emit('update:dialog',$event)" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">User Profile</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md4>
                <v-text-field label="Legal first name*" required></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field label="Legal middle name" hint="example of helper text only on focus"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field
                  label="Legal last name*"
                  hint="example of persistent helper text"
                  persistent-hint
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Email*" required></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Password*" type="password" required></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-select :items="['0-17', '18-29', '30-54', '54+']" label="Age*" required></v-select>
              </v-flex>
              <v-flex xs12 sm6>
                <v-autocomplete
                  :items="['hell','lo','o']"
                  label="Interests"
                  multiple
                ></v-autocomplete>
              </v-flex>
            </v-layout>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="dialog = false">Close</v-btn>
          <v-btn color="blue darken-1" flat @click="dialog = false">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
export default {
  props: {
    dialog: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    accountTypes: {
      "BANK": true,
      "CASH": true,
      "ASSET": true,
      "CREDIT CARD": true,
      "LIABILITY": true,
      "STOCK": true,
      "MUTUAL FUND": true,
      "CURRENCY": true,
      "INCOME": true,
      "EXPENSE": true,
      "EQUITY": true,
      "ACCOUNT RECEIVABLE": true,
      "ACCOUNT PAYABLE": true,
      "TRADING": true,
    },
    others: {
      showHidden: false,
      showUnused: true, // accounts with 0 transactions
      showZero: true, // accounts with 0 balance / total
    }
  })
};
</script>
