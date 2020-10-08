const { knex, Model } = require("../db.js");
const Location = require('../models/Location.js');

knex.select(Location).table(Location).then(result => console.log(result)).catch(err => console.log(err));
