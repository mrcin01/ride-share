const { Model } = require("../db.js");

class Ride extends Model {
  static get tableName() {
    return "Ride";
  }

  static get relationMappings() {
    const Drivers = require("./Drivers.js");
    const Location = require("./Location.js");
    const Vehicle = require("./Vehicle.js");
    const Passenger = require("./Passenger.js");
    const Driver = require("./Driver.js");

    return {
      drivers: {
        relation: Model.HasManyRelation,
        modelClass: Drivers,
        join: {
          from: "Ride.id",
          to: "Drivers.rideId",
        },
      },
      passenger: {
        relation: Model.HasManyRelation,
        modelClass: Passenger,
        join: {
          from: "Ride.id",
          to: "Passenger.rideId",
        },
      },
      vehicle: {
        relation: Model.HasManyRelation,
        modelClass: Vehicle,
        join: {
          from: "Ride.vehicleId",
          to: "Vehicle.id",
        },
      },
      fromLocation: {
        relation: Model.HasManyRelation,
        modelClass: Location,
        join: {
          from: "Ride.fromLocationId",
          to: "Location.id",
        },
      },
      toLocation: {
        relation: Model.HasManyRelation,
        modelClass: Location,
        join: {
          from: "Ride.toLocationId",
          to: "Location.id",
        },
      },
      driver: {
        relation: Model.HasManyRelation,
        modelClass: Driver,
        join: {
          from: "Ride.id",
          through: {
            // drivers is the join table.
            from: 'drivers.rideId',
            to: 'drivers.driverId'
          },
          to: "Driver.id",
        }
      },
    };
  }
}

module.exports = Ride;
