const Authorization = require("../models/Authorization.js");

Authorization.query()
  .then((authorizations) => console.log("Authorizations", authorizations))
  .catch((err) => console.log("Hello: " + err.message));