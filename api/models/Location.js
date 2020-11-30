const { knex, Model } = require("../db.js");

class Location extends Model {
    static get tableName() {
        return "Location";
    }

    static get relationMappings() {
      const State = require('./State.js');
      const Ride = require('./Ride.js');
        return {
            location: {
                relation: Model.HasManyRelation,
                modelClass: Ride,
                join: {
                    from: "Location.id",
                    to: "Ride.toLocationId"
                },
                join: {
                    from: "Location.id",
                    to: "Ride.fromLocationId"
                }
            }
        };
    }
}

module.exports = Location;