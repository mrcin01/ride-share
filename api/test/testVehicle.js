const { knex, Model } = require("../db.js");
const Vehicle = require('../models/Vehicle.js');

knex.select(Vehicle).table(Vehicle).then(result => console.log(result)).catch(err => console.log(err));
