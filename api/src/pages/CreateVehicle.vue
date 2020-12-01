<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Create a New Vehicle</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field
                v-model="make"
                id="make"
                label="Make"
                name="make"
                prepend-icon="mdi-car-settings"
                type="text"
              />
              <v-text-field
                v-model="model"
                id="model"
                label="Model"
                name="model"
                prepend-icon="mdi-car-settings"
                type="text"
              />
              <v-text-field
                v-model="color"
                id="color"
                label="Color"
                name="color"
                prepend-icon="mdi-palette"
                type="text"
              />
              <v-text-field
                v-model="vehicleType"
                id="vehicleType"
                label="Vehicle Type"
                name="vehicleType"
                prepend-icon="mdi-car-settings"
                type="text"
              />
              <v-text-field
                v-model="capacity"
                id="capacity"
                label="Capacity"
                name="capacity"
                prepend-icon="mdi-car-3-plus"
                type="number"
              />
              <v-text-field
                v-model="mpg"
                id="mpg"
                label="Miles per Gallon"
                name="mpg"
                prepend-icon="mdi-counter"
                type="number"
              />
              <v-text-field
                v-model="licenseState"
                id="licenseState"
                label="License State Abbreviation"
                name="licenseState"
                prepend-icon="mdi-card-account-details-star"
                type="text"
              />
              <v-text-field
                v-model="licensePlate"
                id="licensePlate"
                label="License Plate"
                name="licensePlate"
                prepend-icon="mdi-id-card"
                type="text"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn v-on:click="newVehicle" color="primary"
              >Create New Vehicle</v-btn
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
      make: "",
      model: "",
      color: "",
      vehicleType: "",
      capacity: "",
      mpg: "",
      licenseState: "",
      licensePlate: "",

      snackbar: {
        show: false,
        msge: "",
      },
    };
  },

  methods: {
    newVehicle() {
      this.$axios
        .post("/createVehicle", {
          make: this.make,
          model: this.model,
          color: this.color,
          vehicleType: this.vehicleType,
          capacity: this.capacity,
          mpg: this.mpg,
          licenseState: this.licenseState,
          licensePlate: this.licensePlate,
        })
        .then((result) => {
          this.showSnackbar(result.data.msge);
          this.make = "";
          this.model = "";
          this.color = "";
          this.vehicleType = "";
          this.capacity = "";
          this.mpg = "";
          this.licenseState = "";
          this.licensePlate = "";
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
