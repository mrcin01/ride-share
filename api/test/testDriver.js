const { knex, Model } = require("../db.js");
const Driver = require('../models/Driver.js');

knex.select(Driver).table(Driver).then(result => console.log(result)).catch(err => console.log(err));
