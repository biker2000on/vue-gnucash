<template>
  <v-layout row justify-center>
    <v-dialog :value="dialog" @input="$emit('update:dialog')" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Report Settings: {{ title }}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md4>
                <v-text-field label="Report Title*" required v-model="title"></v-text-field>
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
                  :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                  label="Interests"
                  multiple
                ></v-autocomplete>
              </v-flex>
              <v-flex>
                <v-treeview
                  :items="accountTree"
                  hoverable
                  openOnClick
                  multipleActive
                  selectable
                  item-key="guid"
                  v-model="selectedAccounts"
                />
              </v-flex>
            </v-layout>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <!-- <v-btn color="blue darken-1" flat @click="close()">Close</v-btn> -->
          <v-btn color="blue darken-1" flat @click="saveLocal()">Save</v-btn>
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
    },
    accountTree: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    title: null,
    selectedAccounts: [],
  }),
  methods: {
    // close(e) {
    //   $emit('update:dialog',$event)
    // },
    saveLocal(e) {
      const savedData = {
        title: this.title,
        selectedAccounts: this.selectedAccounts
      }
      console.log(savedData)
      // $emit('update:dialog',$event)
      window.localStorage.setItem('report_settings',JSON.stringify(savedData))
    },
    getLocal() {
      let saved = window.localStorage.getItem('report_settings')
      if (saved) {
        saved = JSON.parse(saved)
        this.title = saved.title
        this.selectedAccounts = saved.selectedAccounts
      }
    }
  },
  mounted() {
    this.getLocal()
  }
};
</script>
