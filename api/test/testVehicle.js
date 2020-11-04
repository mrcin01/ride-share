const Vehicle = require("../models/Vehicle.js");
const Vehicle = require("../models/Vehicle.js");

Vehicle.query()
  .then((vehicles) => console.log("Vehicles", vehicles))
  .catch((err) => console.log("Hello: " + err.message));