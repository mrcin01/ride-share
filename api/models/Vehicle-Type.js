const { knex, Model } = require("../db.js");

class Vehicle_Type extends Model {
    static get tableName() {
        return "Vehicle-Type";
    }

    static get relationMappings() {
        const Vehicle = require('./Vehicle.js');
        return {
            Vehicle: {
                relation: Model.OneToManyRelation,
                modelClass: Vehicle,
                join: {
                    from: "Vehicle-Type.id",
                    to: "Vehicle.vehicleTypeId",
                }
            }
        };
    }
}

module.exports = Vehicle_Type;