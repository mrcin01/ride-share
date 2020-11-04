const Location = require("../models/Location.js");

Location.query()
  .then((locations) => console.log("Locations", locations))
  .catch((err) => console.log("Hello: " + err.message));