const User = require("../models/User.js");

User.query()
  .then((users) => console.log("USERS", users))
  .catch((err) => console.log(err.message));

// knex.select(User).table(User).then(result => console.log(result)).catch(err => console.log(err));
