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
                relation: Model.OneToManyRelation,
                modelClass: Authorization,
                join: {
                    from: "Vehicle.id",
                    to: "Authorization.vehicleId"
                },
            },
            Vehicle_Type: {
                relation: Model.OneToManyRelation,
                modelClass: Vehicle_Type,
                join: {
                    from: "Vehicle_Type.id",
                    to: "Vehicle.vehicleTypeId"
                },
            },
            Ride: {
                relation: Model.OneToManyRelation,
                modelClass: Ride,
                join: {
                    from: "Vehicle.id",
                    to: "Ride.vehicleId"
                },
            },
            State: {
                relation: Model.OneToManyRelation,
                modelClass: State,
                join: {
                    from: "State.abbreviation",
                    to: "Vehicle.licenseState"
                },
            },
        };
    }
}

module.exports = Vehicle;