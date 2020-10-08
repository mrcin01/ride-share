const { knex, Model } = require("../db.js");
const Ride = require('../models/Ride.js');

knex.select(Ride).table(Ride).then(result => console.log(result)).catch(err => console.log(err));
