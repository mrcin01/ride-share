const { knex, Model } = require("../db.js");
const User = require('../models/User.js');

knex.select().table("User").then(result => console.log(result)).catch(err => console.log(err));
