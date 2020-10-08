const { knex, Model } = require("../db.js");
const Drivers = require('../models/Drivers.js');

knex.select(Drivers).table(Drivers).then(result => console.log(result)).catch(err => console.log(err));
