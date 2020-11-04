const { knex, Model } = require("../db.js");

class Ride extends Model {
    static get tableName() {
        return "Ride";
    }

    static get relationMappings() {
      const Drivers = require('./Drivers.js');
      const Location = require('./Location.js');
      const Vehicle = require('./Vehicle.js');
      const Passenger = require('./Passenger.js');
        return {
            driver: {
                relation: Model.OneToManyRelation,
                modelClass: Drivers,
                join: {
                    from: "Ride.id",
                    to: "Drivers.rideId"
                }
            },
            passenger: {
                relation: Model.OneToManyRelation,
                modelClass: Passenger,
                join: {
                    from: "Ride.id",
                    to: "Passenger.rideId"
                }
            },
            vehicle: {
                relation: Model.OneToManyRelation,
                modelClass: Vehicle,
                join: {
                    from: "Vehicle.id",
                    to: "Ride.vehicleId"
                }
            },
            fromLocation: {
                relation: Model.OneToManyRelation,
                modelClass: Location,
                join: {
                    from: "Location.id",
                    to: "Ride.fromLocationId"
                }
            },
            toLocation: {
                relation: Model.OneToManyRelation,
                modelClass: Location,
                join: {
                    from: "Location.id",
                    to: "Ride.toLocationId"
                }
            }
        };
    }
}

module.exports = Ride;