const { knex, Model } = require("../db");

class Vehicle extends Model {
    static get tableName() {
        return "Vehicle";
    }

    static get relationMappings() {
      const Vehicle_Type = require('./Vehicle-Type.js');
      const Authorization = require('./Authorization.js');
      const Ride = require('./Ride.js');
      const State = require('./State.js');
        return {
            authorizations: {
                relation: Model.OneToManyRelation,
                modelClass: Authorization,
                join: {
                    from: "Vehicle.id",
                    to: "Authorization.vehicleId"
                }
            },
            type: {
                relation: Model.OneToManyRelation,
                modelClass: Vehicle_Type,
                join: {
                    from: "Vehicle_Type.id",
                    to: "Vehicle.vehicleTypeId"
                }
            },
            rides: {
                relation: Model.OneToManyRelation,
                modelClass: Ride,
                join: {
                    from: "Vehicle.id",
                    to: "Ride.vehicleId"
                }
            },
            state: {
                relation: Model.OneToManyRelation,
                modelClass: State,
                join: {
                    from: "State.abbreviation",
                    to: "Vehicle.licenseState"
                }
            },
        };
    }
}
