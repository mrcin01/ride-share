const Passenger = require("../models/Passenger.js");

Passenger.query()
  .then((passengers) => console.log("Passengers", passengers))
  .catch((err) => console.log("Hello: " + err.message));