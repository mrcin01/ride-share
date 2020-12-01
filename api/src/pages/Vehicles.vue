<template>
  <v-container>
    <div>
      <h4 class="display-1">Vehicles</h4>

      <v-data-table
        class="elevation-1"
        v-bind:headers="headers"
        v-bind:items="vehicles"
      >
        <template v-slot:item="{ item }">
          <tr v-bind:class="itemClass(item)">
            <td>{{ item.make }}</td>
            <td>{{ item.model }}</td>
            <td>{{ item.color }}</td>
            <td>{{ item.vehicleType }}</td>
            <td>{{ item.capacity }}</td>
            <td>{{ item.mpg }}</td>
            <td>{{ item.licenseState }}</td>
            <td>{{ item.licensePlate }}</td>
          </tr>
        </template>
      </v-data-table>

      <v-snackbar v-model="snackbar.show">
        {{ snackbar.text }}
        <v-btn color="blue" text @click="snackbar.show = false">
          Close
        </v-btn>
      </v-snackbar>
    </div>
  </v-container>
</template>

<script>
export default {
  name: "Vehicles",

  data: function() {
    return {

      headers: [
        { text: "Make", value: "make" },
        { text: "Time", value: "time" },
        { text: "Distance", value: "distance" },
        { text: "Vehicle Type", value: "vehicleType" },
        { text: "Capacity", value: "capacity" },
        { text: "Miles Per Gallon", value: "mpg" },
        { text: "License State", value: "licenseState" },
        { text: "License Plate", value: "licensePlate" },
      ],
      vehicles: [],

      snackbar: {
        show: false,
        text: "",
      },
    };
  },

  mounted: function() {
    this.$axios.get("/vehicles").then((response) => {
      this.vehicles = response.data.map((vehicle) => {
        const rtn = {
          id: vehicle.id,
          make: vehicle.make,
          model: vehicle.model,
          color: vehicle.color,
          vehicleType: vehicle.Vehicle_Type[0].type,
          capacity: vehicle.capacity,
          mpg: vehicle.mpg,
          licenseState: vehicle.State[0].abbreviation,
          licensePlate: vehicle.licensePlate,
        };

        return rtn;
      });
    });
  },

  methods: {
    // Display a snackbar message.
    showSnackbar(text) {
      this.snackbar.text = text;
      this.snackbar.show = true;
    },

    // Calculate the CSS class for an item
    itemClass(item) {
      return item;
    },
  },
};
</script>
