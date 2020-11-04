const Ride = require("../models/Ride.js");

Ride.query()
  .then((rides) => console.log("Rides", rides))
  .catch((err) => console.log("Hello: " + err.message));