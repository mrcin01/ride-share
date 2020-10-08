const { knex, Model } = require("../db.js");

class User extends Model {
    static get tableName() {
        return "User";
    }

    static get relationMappings() {
        const Driver = require('./Driver.js');
        const Passenger = require('./Passenger.js');
        return {
            Driver: {
                relation: Model.OneToManyRelation,
                modelClass: Driver,
                join: {
                    from: "User.id",
                    to: "Driver.user_id",
                }
            },
            Passenger: {
                relation: Model.OneToManyRelation,
                modelClass: Passenger,
                join: {
                    from: "User.id",
                    to: "Passenger.passengerId"
                }
            }
        };
    }
}
