const User = require("../models/User.js");

User.query()
  .then((users) => console.log("Users", users))
  .catch((err) => console.log("Hello: " + err.message));
