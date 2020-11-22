const { knex, Model } = require("../db.js");
const { hash, compare } = require("bcrypt");

const SALT_ROUNDS = 10;

class User extends Model {
  static get tableName() {
    return "User";
  }

  static get relationMappings() {
    const Driver = require("./Driver.js");
    const Passenger = require("./Passenger.js");
    
    return {
      Driver: {
        relation: Model.OneToManyRelation,
        modelClass: Driver,
        join: {
          from: "User.id",
          to: "Driver.userId",
        },
      },
      Passenger: {
        relation: Model.OneToManyRelation,
        modelClass: Passenger,
        join: {
          from: "User.id",
          to: "Passenger.passengerId",
        },
      },
    };
  }

  // eslint-disable-next-line no-unused-vars
  async $beforeInsert(queryContext) {
    this.password = await hash(this.password, SALT_ROUNDS);
  }

  async verifyPassword(plainTextPassword) {
    return compare(plainTextPassword, this.password);
  }
}

module.exports = User;
