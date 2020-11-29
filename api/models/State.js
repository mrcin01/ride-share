const { Model } = require("../db.js");

class State extends Model {
  static get tableName() {
    return "State";
  }

  static get relationMappings() {
    const Driver = require("./Driver.js");
    const Location = require("./Location.js");
    const Vehicle = require("./Vehicle.js");
    return {
      drivers: {
        relation: Model.OneToManyRelation,
        modelClass: Driver,
        join: {
          from: "State.abbreviation",
          to: "Driver.licenseState",
        },
      },
      vehicles: {
        relation: Model.OneToManyRelation,
        modelClass: Vehicle,
        join: {
          from: "State.abbreviation",
          to: "Vehicle.licenseState",
        },
      },
      locations: {
        relation: Model.OneToManyRelation,
        modelClass: Location,
        join: {
          from: "State.abbreviation",
          to: "Location.state",
        },
      },
    };
  }
}

module.exports = State;
