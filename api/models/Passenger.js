const { knex, Model } = require("../db");

class Passenger extends Model {
    static get tableName() {
        return "Passenger";
    }

    static get relationMappings() {
      const User = require('./User.js');
      const Ride = require('./Ride.js');
        return {
            user: {
                relation: Model.OneToManyRelation,
                modelClass: User,
                join: {
                    from: "User.id",
                    to: "Passenger.passengerId"
                }
            },
            ride: {
                relation: Model.OneToManyRelation,
                modelClass: Ride,
                join: {
                    from: "Ride.id",
                    to: "Passenger.rideId"
                }
            }
        };
    }
}