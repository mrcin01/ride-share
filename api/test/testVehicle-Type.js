const { knex, Model } = require("../db.js");
const Vehicle_Type = require('../models/Vehicle-Type.js');

knex.select(Vehicle_Type).table(Vehicle_Type).then(result => console.log(result)).catch(err => console.log(err));
