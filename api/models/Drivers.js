const { knex, Model } = require("../db.js");

class Drivers extends Model {
    static get tableName() {
        return "Drivers";
    }

    static get relationMappings() {
      const Driver = require('./Driver.js');
      const Ride = require('./Ride.js');
        return {
            Driver: {
                relation: Model.HasManyRelation,
                modelClass: Driver,
                join: {
                    from: "Drivers.driverid",
                    to: "Driver.id"
                }
            },
            Ride: {
                relation: Model.HasManyRelation,
                modelClass: Ride,
                join: {
                    from: "Drivers.rideid",
                    to: "Ride.id"
                }
            }
        };
    }
}

module.exports = Drivers;