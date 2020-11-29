const { Model } = require("../db.js");

class Driver extends Model {
  static get tableName() {
    return "Driver";
  }

  static get relationMappings() {
    const User = require("./User.js");
    const State = require("./State.js");
    return {
      user: {
        relation: Model.HasManyRelation,
        modelClass: User,
        join: {
          from: "User.id",
          to: "Driver.userId",
        },
      },
      state: {
        relation: Model.HasManyRelation,
        modelClass: State,
        join: {
          from: "State.abbreviation",
          to: "Driver.licenseState",
        },
      },
    };
  }
}

module.exports = Driver;
