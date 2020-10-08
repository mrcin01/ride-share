const { knex, Model } = require("../db.js");
const Passenger = require('../models/Passenger.js');

knex.select(Passenger).table(Passenger).then(result => console.log(result)).catch(err => console.log(err));
