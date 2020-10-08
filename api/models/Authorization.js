const { knex, Model } = require("../db");

class Authorization extends Model {
    static get tableName() {
        return "Authorization";
    }

    static get relationMappings() {
      const Driver = require('./Driver.js');
      const Vehicle = require('./Vehicle.js');
        return {
            driver: {
                relation: Model.OneToManyRelation,
                modelClass: Driver,
                join: {
                    from: "Driver.id",
                    to: "Authorization.driverId"
                }
            },
            vehicle: {
                relation: Model.OneToManyRelation,
                modelClass: Driver,
                join: {
                    from: "Vehicle.id",
                    to: "Authorization.vehicleId"
                }
            }
        };
    }
}
