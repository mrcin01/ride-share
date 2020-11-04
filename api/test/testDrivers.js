const Drivers = require("../models/Drivers.js");

Drivers.query()
  .then((driverss) => console.log("USERS", driverss))
  .catch((err) => console.log("Hello: " + err.message));