const { knex, Model } = require("../db.js");

class Vehicle extends Model {
    static get tableName() {
        return 'Vehicle';
    }

    static get relationMappings() {
      const Vehicle_Type = require('./Vehicle-Type.js');
      const Authorization = require('./Authorization.js');
      const Ride = require('./Ride.js');
      const State = require('./State.js');
        return {
            Authorization: {
                relation: Model.HasManyRelation,
                modelClass: Authorization,
                join: {
                    from: "Vehicle.id",
                    to: "Authorization.vehicleId"
                },
            },
            Vehicle_Type: {
                relation: Model.HasManyRelation,
                modelClass: Vehicle_Type,
                join: {
                    from: "Vehicle.vehicleTypeId",
                    to: "Vehicle-Type.id"
                },
            },
            Ride: {
                relation: Model.HasManyRelation,
                modelClass: Ride,
                join: {
                    from: "Vehicle.id",
                    to: "Ride.vehicleId"
                },
            },
            State: {
                relation: Model.HasManyRelation,
                modelClass: State,
                join: {
                    from: "Vehicle.licenseState",
                    to: "State.abbreviation"
                },
            },
        };
    }
}

module.exports = Vehicle;