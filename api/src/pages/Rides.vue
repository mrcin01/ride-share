<template>
  <v-container>
    <div>
      <h4 class="display-1">Rides</h4>

      <v-text-field v-model="search" label="Search"></v-text-field>
      <v-data-table
        class="elevation-1"
        v-bind:headers="headers"
        v-bind:items="rides"
        v-bind:search="search"
      >
        <template v-slot:item="{ item }">
          <tr v-bind:class="itemClass(item)">
            <td>{{ item.date }}</td>
            <td>{{ item.time }}</td>
            <td>{{ item.distance }}</td>
            <td>{{ item.fuelPrice }}</td>
            <td>{{ item.fee }}</td>
            <td>{{ item.vehicle }}</td>
            <td>{{ item.capacity }}</td>
            <td>{{ item.fromLocation }}</td>
            <td>{{ item.toLocation }}</td>
            <td>
              <span v-if="item.currentUserIsPassenger">ON RIDE</span>
              <v-btn v-else color="blue" text @click="createPassenger(item)">
                Join
              </v-btn>
            </td>
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
  name: "Rides",

  data: function() {
    return {
      search: "",

      headers: [
        { text: "Date", value: "date" },
        { text: "Time", value: "time" },
        { text: "Distance", value: "distance" },
        { text: "Fuel Price", value: "fuelPrice" },
        { text: "Fee", value: "fee" },
        { text: "Vehicle", value: "vehicle" },
        { text: "Capacity", value: "capacity" },
        { text: "From Location", value: "fromLocation" },
        { text: "To Location", value: "toLocation" },
        { text: "Join Ride", value: "passenger" },
      ],
      rides: [],

      snackbar: {
        show: false,
        text: "",
      },
    };
  },

  mounted: function() {
    this.$axios.get("/rides").then((response) => {
      this.rides = response.data.map((ride) => {
        const rtn = {
          id: ride.id,
          date: ride.date,
          time: ride.time,
          distance: ride.distance,
          fuelPrice: ride.fuelPrice,
          fee: ride.fee,
          vehicle:
            ride.vehicle[0].make +
            " " +
            ride.vehicle[0].model +
            " " +
            ride.vehicle[0].color,
          capacity: `${ride.passenger.length + ride.drivers.length}/${
            ride.vehicle[0].capacity
          }`,
          fromLocation: ride.fromLocation[0].name,
          toLocation: ride.toLocation[0].name,
          passengers: ride.passenger,
          drivers: ride.drivers,
        };

        rtn.currentUserIsPassenger = this.isCurrentUserRiding(rtn);
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

    // Is the currently logged-in user a passenger on `ride`?
    isCurrentUserRiding(ride) {
      if (this.$store.state.currentAccount) {
        const currentId = this.$store.state.currentAccount.id;
        return (
          ride.passengers.find(
            (passenger) => passenger.passengerId === currentId
          ) || ride.drivers.find((driver) => driver.userId === currentId)
        );
      } else {
        return false;
      }
    },

    createPassenger(item) {
      const currentAccount = this.$store.state.currentAccount;
      let capacity = item.capacity.split("/");
      let currPassengers = Math.floor(capacity[0]);
      let maxPassengers = Math.floor(capacity[1]);
      if (currPassengers < maxPassengers) {
        this.$axios
          .post("/passenger", {
            passengerId: currentAccount.id,
            rideId: item.id,
          })
          .then((result) => {
            if (result.data.ok == true) {
              console.log("Success!");
              item.capacity = currPassengers + 1 + "/" + maxPassengers;
              // Update the users's status on this ride, which should reactively update the UI.
              this.$set(item, "currentUserIsPassenger", true);
            } else {
              console.log("Failed to create passenger");
            }
          })
          .catch((err) => console.log(err));
      } else {
        console.log("Ride is full");
        return;
      }
    },
  },
};
</script>
