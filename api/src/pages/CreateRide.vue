<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Create a New Ride</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field
                v-model="date"
                id="date"
                label="Date"
                name="Date"
                prepend-icon="mdi-calendar-month"
                type="date"
              />
              <v-text-field
                v-model="time"
                id="time"
                label="Time"
                name="time"
                prepend-icon="mdi-alarm"
                type="time"
              />
              <v-text-field
                v-model="distance"
                id="distance"
                label="Distance"
                name="distance"
                prepend-icon="mdi-map-marker-radius"
                type="number"
              />
              <v-text-field
                v-model="fuelPrice"
                id="fuelPrice"
                label="Fuel Price"
                name="fuelPrice"
                prepend-icon="mdi-gas-station"
                type="number"
              />
              <v-text-field
                v-model="fee"
                id="fee"
                label="Fee"
                name="fee"
                prepend-icon="mdi-cash"
                type="number"
              />
              <v-text-field
                v-model="vehicleModel"
                id="vehicleModel"
                label="Vehicle Model"
                name="vehicleModel"
                prepend-icon="mdi-car-outline"
                type="text"
              />
              <v-text-field
                v-model="fromLocation"
                id="fromLocation"
                label="From Location"
                name="fromLocation"
                prepend-icon="mdi-map-marker-plus"
                type="text"
              />
              <v-text-field
                v-model="toLocation"
                id="toLocation"
                label="To Location"
                name="toLocation"
                prepend-icon="mdi-map-marker-circle"
                type="text"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn v-on:click="newRide" color="primary"
              >Create New Ride</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar.show">
      {{ snackbar.msge }}
      <v-btn text color="primary" @click="snackbar.show = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      date: "",
      time: "",
      distance: "",
      fuelPrice: "",
      fee: "",
      vehicleModel: "",
      fromLocation: "",
      toLocation: "",

      snackbar: {
        show: false,
        msge: "",
      },
    };
  },

  methods: {
    newRide() {
      this.$axios
        .post("/createRide", {
          date: this.date,
          time: this.time,
          distance: this.distance,
          fuelPrice: this.fuelPrice,
          fee: this.fee,
          vehicleModel: this.vehicleModel,
          fromLocation: this.fromLocation,
          toLocation: this.toLocation,
        })
        .then((result) => {
          this.showSnackbar(result.data.msge);
          this.date = "";
          this.time = "";
          this.distance = "";
          this.fuelPrice = "";
          this.fee = "";
          this.vehicleModel = "";
          this.fromLocation = "";
          this.toLocation = "";
        })
        .catch((err) => this.showSnackbar(err));
    },

    showSnackbar(msge) {
      this.snackbar.msge = msge;
      this.snackbar.show = true;
    },
  },
};
</script>
