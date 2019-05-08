<template>
  <datatable id="data-table-options" :source="customers.columns" :filterable="false" editable>
    <datatable-column id="purchasor_name" label="Name" width="25"></datatable-column>
    <datatable-column id="purchasor_email" label="Email"></datatable-column>
    <datatable-column id="purchase_date" label="Date" data-intro="Clicking a column will sort by that column" data-step="4"></datatable-column>
    <datatable-column id="purchase_amount" label="Cost" data-intro="Drag a column into the middle of the table to group by that column. You can repeat this process to perform nested grouping" data-step="5"></datatable-column>
    <!-- <template slot="sortable" scope="cell">
        <div class="datatable-options-toggle">
            <toggle :id="cell.row.id + '-sortable'" v-model="cell.row.sortable"></toggle>
        </div>
    </template>
    <template slot="groupable" scope="cell">
        <div class="datatable-options-toggle">
            <toggle :id="cell.row.id + '-groupable'" v-model="cell.row.groupable"></toggle>
        </div>   
    </template> -->
  </datatable>
</template>

<script>
import DatatableCell from './datatable/datatable-cell.js'
import DatatableCollective from './datatable/datatable-collection.vue'
import DatatableColumn from './datatable/datatable-column.vue'
import Datatable from './datatable/datatable.vue'

// var aggregators = vuetiful.aggregators;
// var formatters = vuetiful.formatters;
// var currencies = vuetiful.maps.currencies;

var customers = {
    striped: true,
    editable: false,
    lineNumbers: false,
    filter: null,

    currency: "USD",
    dateFormat: "D MMMM YYYY",
    
    columns: [
        {
            id: "purchasor_name",
            label: "Client Name",
            width: null,
            sortable: true,
            groupable: true,
            aggregators: []
        },
        {
            id: "purchasor_email",
            label: "Client Email",
            width: 25,
            sortable: true,
            groupable: true,
            aggregators: []
        },
        {
            id: "purchase_date",
            label: "Purchase Date",
            width: null,
            sortable: true,
            groupable: true,
            aggregators: [],
            // formatter: function (value) {
            //     return formatters.datetime(value, customers.dateFormat);
            // }
        },
        {
            id: "purchase_amount",
            label: "Purchase Amount",
            width: null,
            sortable: true,
            groupable: true,
            aggregators: [],
            // formatter: function (value) {
            //     return formatters.currency(value, 2, customers.currency);
            // }
        }
    ],

    rows: [
        {
            id: "0584e8d2-984c-4ce0-a20f-8b9e21cd2c00",
            purchasor_name: "Nancy Fuller",
            purchasor_email: "nfuller0@about.me",
            purchase_date: "2002-01-02T04:45:48Z",
            purchase_amount: 1166.14
        },
        {
            id: "f4769183-38af-4c22-8383-6dea302466fd",
            purchasor_name: "Melissa Meyer",
            purchasor_email: "mmeyer1@angelfire.com",
            purchase_date: "2010-05-15T08:13:59Z",
            purchase_amount: 6123.50
        },
        {
            id: "e171c9fb-2438-4f23-8d0d-011b2d8e95bc",
            purchasor_name: "Larry Rose",
            purchasor_email: "lrose2@cdbaby.com",
            purchase_date: "2014-11-23T09:18:18Z",
            purchase_amount: 8288.27
        },
        {
            id: "3cad078d-083b-416e-9dd4-2f1470c3458d",
            purchasor_name: "Jack Simpson",
            purchasor_email: "jsimpson3@mayoclinic.com",
            purchase_date: "2002-01-02T04:45:48Z",
            purchase_amount: 1215.03
        },
        {
            id: "ef7ff12c-90e5-4bfb-8fdd-9f20e4206afa",
            purchasor_name: "Ernest Watson",
            purchasor_email: "ewatson4@nytimes.com",
            purchase_date: "2002-01-02T04:45:48Z",
            purchase_amount: 9455.16
        },
        {
            id: "b243be08-6b9c-4ebd-bb8b-b59256ad4956",
            purchasor_name: "Adam Castillo",
            purchasor_email: "acastillo5@dailymotion.com",
            purchase_date: "2014-08-22T08:14:28Z",
            purchase_amount: 9988.45
        },
        {
            id: "a491adf5-8129-4f93-9442-98522fbd1e90",
            purchasor_name: "Wayne Wilson",
            purchasor_email: "wwilson6@indiegogo.com",
            purchase_date: "2012-03-07T22:16:08Z",
            purchase_amount: 4563.87
        },
        {
            id: "497a6cca-5c9c-4b93-af8e-63c93de3eacf",
            purchasor_name: "Roy Coleman",
            purchasor_email: "rcoleman7@independent.co.uk",
            purchase_date: "2010-09-14T05:05:17Z",
            purchase_amount: 4563.87
        },
        {
            id: "ea34a698-fb86-44a5-b80e-57087d48737c",
            purchasor_name: "Betty Diaz",
            purchasor_email: "bdiaz8@dropbox.com",
            purchase_date: "2012-03-07T22:16:08Z",
            purchase_amount: 7527.62
        },
        {
            id: "c48e5e68-cae5-4a2e-96b2-8509fca19ddb",
            purchasor_name: "Sharon Gardner",
            purchasor_email: "sgardner9@seesaa.net",
            purchase_date: "2004-10-14T14:59:00Z",
            purchase_amount: 1166.14
        }
    ], 

    selected: []
};

export default {
  components: {
    DatatableCell, DatatableCollective, DatatableColumn, Datatable,
  },
  data: () => ({
    customers: customers,
  }), 
  methods: {
    
  }
}
</script>

<style>

</style>
