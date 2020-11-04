const State = require("../models/State.js");

State.query()
  .then((states) => console.log("States", states))
  .catch((err) => console.log("Hello: " + err.message));