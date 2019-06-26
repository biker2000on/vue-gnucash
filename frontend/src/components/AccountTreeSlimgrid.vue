<template>
  <slim-grid 
    v-if="accountTree" 
    pk="guid" 
    :data="accountTree" 
    :column-options="columnOptions" 
    :height="550" 
    forceFitColumns 
    fullWidthRows 
    :downloadable="false"
  />
</template>

<script>
import SlimGrid from 'vue-slimgrid'

export default {
  components: {
    SlimGrid,
  },
  props: {
    accountTree: {
      type: Array,
      required: true,
    }
  },
  data: () => ({
  }),
  computed: {
    columnOptions() {
      return {
        name: {
          name: 'Name',
          cssClass: 'text-left',
        },
        description: {
          name: "Description",
          cssClass: 'text-left',
        }
      }
    }
  }

}
</script>
