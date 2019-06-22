<template>
  <tabulator
    v-if="accountTree.length > 0"
    :columns="columns"
    :tableData="accountTree"
    :tabulatorSettings="tabulatorSettings"
  />
</template>

<script>
import Tabulator from './Tabulator'

const tabulatorSettings = {
  dataTree: true,
  dataTreeChildField: "children",
  dataTreeStartExpanded: true,
  layout: "fitDataFill"
};

export default {
  components: {
    Tabulator,
  },
  props: {
    accountTree: {
      type: Array,
      required: true,
    }
  },
  data: () => ({
    tabulatorSettings: tabulatorSettings,
  }),
  computed: {
    columns() {
      return [
        {
          title: "Name",
          field: "name",
        },
        {
          title: "Description",
          field: 'description',
        }
      ]
    }
  }

}
</script>
