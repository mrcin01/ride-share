<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Create a New Location</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field
                v-model="name"
                id="name"
                label="Name"
                name="name"
                prepend-icon="mdi-map-marker-radius"
                type="text"
              />
              <v-text-field
                v-model="address"
                id="address"
                label="Address"
                name="address"
                prepend-icon="mdi-map-marker-radius"
                type="text"
              />
              <v-text-field
                v-model="city"
                id="city"
                label="City"
                name="city"
                prepend-icon="mdi-map-marker-radius"
                type="text"
              />
              <v-text-field
                v-model="stateAbbr"
                id="stateAbbr"
                label="State Abbreviation"
                name="stateAbbr"
                prepend-icon="mdi-map-marker-radius"
                type="text"
              />
              <v-text-field
                v-model="zipCode"
                id="zipCode"
                label="Zip Code"
                name="zipCode"
                prepend-icon="mdi-map-marker-radius"
                type="text"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn v-on:click="newLocation" color="primary"
              >Create New Location</v-btn
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
      name: "",
      address: "",
      city: "",
      stateAbbr: "",
      zipCode: "",

      snackbar: {
        show: false,
        msge: "",
      },
    };
  },

  methods: {
    newLocation() {
      this.$axios
        .post("/createLocation", {
          name: this.name,
          address: this.address,
          city: this.city,
          stateAbbr: this.stateAbbr,
          zipCode: this.zipCode,
        })
        .then((result) => {
          this.showSnackbar(result.data.msge);
          this.name = "";
          this.address = "";
          this.city = "";
          this.stateAbbr = "";
          this.zipCode = "";
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
