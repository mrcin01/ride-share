const { knex, Model } = require("../db.js");
const Authorization = require('../models/Authorization.js');

knex.select(Authorization).table(Authorization).then(result => console.log(result)).catch(err => console.log(err));
