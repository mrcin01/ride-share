const Vehicle_Type = require("../models/Vehicle-Type.js");

Vehicle_Type.query()
  .then((vehicle_types) => console.log("Vehicle-Types", vehicle_types))
  .catch((err) => console.log("Hello: " + err.message));