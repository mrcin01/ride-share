const Driver = require("../models/Driver.js");

Driver.query()
  .then((drivers) => console.log("Drivers", drivers))
  .catch((err) => console.log("Hello: " + err.message));