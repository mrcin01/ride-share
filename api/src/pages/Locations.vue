<template>
  <v-container>
    <div>
      <h4 class="display-1">Locations</h4>

      <v-data-table
        class="elevation-1"
        v-bind:headers="headers"
        v-bind:items="locations"
      >
        <template v-slot:item="{ item }">
          <tr v-bind:class="itemClass(item)">
            <td>{{ item.name }}</td>
            <td>{{ item.address }}</td>
            <td>{{ item.city }}</td>
            <td>{{ item.state }}</td>
            <td>{{ item.zipCode }}</td>
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
  name: "Locations",

  data: function() {
    return {

      headers: [
        { text: "Name", value: "name" },
        { text: "Address", value: "address" },
        { text: "City", value: "city" },
        { text: "State", value: "state" },
        { text: "Zip Code", value: "zipCode" },
      ],
      locations: [],

      snackbar: {
        show: false,
        text: "",
      },
    };
  },

  mounted: function() {
    this.$axios.get("/locations").then((response) => {
      this.locations = response.data.map((location) => {
        const rtn = {
          id: location.id,
          name: location.name,
          address: location.address,
          city: location.city,
          state: location.State[0].name,
          zipCode: location.zipCode,
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
