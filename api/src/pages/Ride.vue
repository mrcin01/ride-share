<template>
  <v-container>
    <div>
      <h4 class="display-1">Rides</h4>

      <v-data-table
        class="elevation-1"
        v-bind:headers="headers"
        v-bind:items="rides"
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
              <v-btn color="blue" text @click="createPassenger(item)"
                >Join</v-btn
              >
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
      console.log(response.data);
      this.rides = response.data.map((ride) => ({
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
        capacity: `${ride.passenger.length}/${ride.vehicle[0].capacity}`,
        fromLocation: ride.fromLocation[0].name,
        toLocation: ride.toLocation[0].name,
      }));
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

    // I would like this function to give me all the rides so I can use this data in createPassenger to check for if a passenger is already on a ride.
    getRides() {
      const currentRides = this.$axios.get("/rides");
      return currentRides;
    },

    createPassenger(item) {
      const currentRides = this.getRides();
      console.log("Current Rides");
      console.log(currentRides);
      const currentAccount = this.$store.state.currentAccount;
      console.log(currentAccount.id);
      console.log(item.id);
      let capacity = item.capacity.split("/");
      let currPassengers = Math.floor(capacity[0]);
      let maxPassengers = Math.floor(capacity[1]);
      if (currPassengers < maxPassengers) {
        this.$axios
          .post("/passenger", {
            passengerId: currentAccount.id,
            rideId: item.id,
          })
          .then(() => {
            console.log("Success!");
            item.capacity = currPassengers + 1 + "/" + maxPassengers;
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
