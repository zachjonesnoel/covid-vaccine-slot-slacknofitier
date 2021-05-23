<template>
  <v-container fluid>
     <v-row align="center">
      <v-col
        class="d-flex"
        cols="3"
        sm="3"
      >
        <v-select
          :items="states"
          label="States"
          item-text="state_name"
          item-value="state_id"
          v-model="selectedState"
          :loading="loadingStates"
        ></v-select>
      </v-col>
      <v-col
        class="d-flex"
        cols="3"
        sm="6"
        md="3"
      >
        <v-select
          :items="districts"
          label="Districts"
          item-text="district_name"
          item-value="district_id"
          v-model="selectedDistrict"
          :loading="loadingDistricts"
        ></v-select>
      </v-col>
       <v-col
        class="d-flex"
        cols="3"
        sm="3"
      >
        <v-text-field
            label="PINCODE"
            v-model="pincode"
          ></v-text-field>
      </v-col>
       <v-col
        class="d-flex"
        cols="3"
        sm="2"
      >
        <v-menu
        ref="menu"
        v-model="menu"
        :close-on-content-click="false"
        :return-value.sync="date"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="date"
            label="Date (7 days slot)"
            append-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
<v-date-picker v-model="date" no-title scrollable>
  <v-spacer></v-spacer>
  <v-btn text color="primary" @click="menu = false">
    Cancel
  </v-btn>
  <v-btn text color="primary" @click="$refs.menu.save(date)">
    OK
  </v-btn>
</v-date-picker>
</v-menu>
</v-col>
<v-col class="d-flex" cols="12" sm="1">
  <v-btn fab dark small color="primary" @click="searchVaccineSlots()">
    <v-icon dark>
      mdi-file-find
    </v-icon>
  </v-btn>
</v-col>
</v-row>
<v-row align="center">
  <v-col cols="12" sm="12">
    <v-data-table dense :headers="vaccineCentersHeaders" :items="vaccineCenters" :items-per-page="10" class="elevation-1">
      <template v-slot:top>
         <v-dialog
          v-model="sessionsDialog"
          max-width="500px"
        >
           <SessionsDialog :center="editedItem"/>
           </v-dialog>
           </template>
      <template v-slot:item.sessions="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-eye
      </v-icon>
      
    </template>

    </v-data-table>
  </v-col>
</v-row>
</v-container>
</template>

<script>
  import SessionsDialog from './SessionsDialog.vue';
  var axios = require('axios');
  export default {
    name: 'ListCenters',
    components: {
      SessionsDialog,
    },
    data: () => ({
      states: [],
      districts: [],
      selectedState: null,
      selectedDistrict: null,
      loadingStates: false,
      loadingDistricts: false,
      date: new Date().toISOString().substr(0, 10),
      menu: false,
      modal: false,
      menu2: false,
      vaccineCenters: [],
      vaccineCentersHeaders: [{
          text: 'Name',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        {
          text: 'Address',
          align: 'start',
          sortable: false,
          value: 'address',
        },
        {
          text: 'Pincode',
          align: 'start',
          sortable: false,
          value: 'pincode',
        },
        {
          text: 'From',
          align: 'start',
          sortable: false,
          value: 'from',
        },
        {
          text: 'To',
          align: 'start',
          sortable: false,
          value: 'to',
        },
        {
          text: 'Sessions',
          align: 'start',
          sortable: false,
          value: 'sessions',
        },
        // { text: 'Actions', value: 'actions', sortable: false },
      ],
      dialog: false,
      editedIndex: -1,
      editedItem: {
        name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
      },
      sessionsDialog: false,
      pincode: null,
    }),
    mounted() {
      this.getAllStates()
    },
    methods: {
      editItem(item) {
        //console.log(item)
        this.editedItem = Object.assign({}, item)
        this.sessionsDialog = true;
      },
      formatDate(date) {
        if (!date) return null

        const [year, month, day] = date.split('-')
        return `${day}-${month}-${year}`
      },
      async getAllStates() {
        this.loadingStates = true
        try {
          const response = await axios.get('https://cdn-api.co-vin.in/api/v2/admin/location/states');
          //console.log(response.data);
          this.states = response.data.states
          this.loadingStates = false
        }
        catch (error) {
          console.error(error);
        }
      },
      async getAllDistrictsForState(selectedStateID) {
        this.loadingDistricts = true
        try {
          const response = await axios.get('https://cdn-api.co-vin.in/api/v2/admin/location/districts/' + selectedStateID);
          //console.log(response.data);
          this.districts = response.data.districts
          this.loadingDistricts = false
        }
        catch (error) {
          console.error(error);
        }
      },
      async searchVaccineSlots() {
        let vaccineAPIEndpoint = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${this.selectedDistrict}&date=${this.formatDate(this.date)}`
        if (this.pincode != null) {
          vaccineAPIEndpoint = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=${this.pincode}&date=${this.formatDate(this.date)}`
        }
        try {
          const response = await axios.get(vaccineAPIEndpoint);
          //console.log(response.data);
          this.vaccineCenters = response.data.centers
          this.loadingDistricts = false
        }
        catch (error) {
          console.error(error);
        }
      }
    },
    watch: {
      selectedState(val) {
        this.getAllDistrictsForState(val)
      }
    }
  }
</script>
