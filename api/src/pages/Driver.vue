<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Sign Up As a Driver</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field
                v-model="licenseNumber"
                label="License Number"
                name="License Number"
                prepend-icon="mdi-id-card"
                type="text"
              />
              <v-text-field
                v-model="licenseState"
                id="License-State"
                label="License State"
                name="License State"
                prepend-icon="mdi-earth"
                type="text"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn v-on:click="newDriver" color="primary"
              >Be a Driver Now!</v-btn
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
      licenseNumber: "",
      licenseState: "",

      snackbar: {
        show: false,
        msge: "",
      },
    };
  },

  methods: {
    newDriver() {
      const currentId = this.$store.state.currentAccount.id;
      this.$axios
        .post("/driver", {
          userId: currentId,
          licenseNumber: this.licenseNumber,
          licenseState: this.licenseState,
        })
        .then((result) => {
          this.showSnackbar(result.data.msge);
          this.licenseNumber = "";
          this.licenseState = "";
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
