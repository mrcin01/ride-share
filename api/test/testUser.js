const { knex, Model } = require("../db.js");
const User = require('../models/User.js');

/*User.query()
    .then((users) => {
        users.forEach((user) => {
            console.log("user:", user);

            console.log("last_name", user.lastName);
        });
        knex.destroy();
    })
    .catch((err) => console.log(err.message));*/

knex.select(User).table(User).then(result => console.log(result)).catch(err => console.log(err));
