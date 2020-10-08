const { knex, Model } = require("../db.js");
const State = require('../models/State.js');

knex.select(State).table(State).then(result => console.log(result)).catch(err => console.log(err));
