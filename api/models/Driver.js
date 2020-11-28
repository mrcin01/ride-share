const { knex, Model } = require("../db.js");

class Driver extends Model {
    static get tableName() {
        return "Driver";
    }

    static get relationMappings() {
      const User = require('./User.js');
      const Authorization = require('./Authorization.js');
      const State = require('./State.js');
      const Drivers = require('./Drivers.js');
        return {
            user: {
                relation: Model.HasManyRelation,
                modelClass: User,
                join: {
                    from: "User.id",
                    to: "Driver.userId"
                }
            },
            state: {
                relation: Model.HasManyRelation,
                modelClass: State,
                join: {
                    from: "State.abbreviation",
                    to: "Driver.licenseState"
                }
            }
        };
    }
}

module.exports = Driver;