const Passenger = require("../models/Passenger");
const Driver = require("../models/Driver");
const Drivers = require("../models/Drivers");
const Ride = require("../models/Ride");
const Authorization = require("../models/Authorization");

class RideHelper {
  constructor(userId, rideId) {
    this.userId = userId;
    this.rideId = rideId;

    this._ride = null;
    this._driver = null;
  }

  async getDriver() {
    console.group("GET DRIVER");
    if (!this._driver) {
      console.log("MEMOIZE DRIVER");
      this._driver = await Driver.query()
        .where("userId", this.userId)
        .first();
    }
    console.log("DRIVER", this._driver || "[NONE]");
    console.groupEnd();
    return this._driver;
  }

  async isDriver() {
    console.group("IS DRIVER");
    const driver = await this.getDriver();
    console.log("DRIVER", driver || "[NONE]");
    console.groupEnd();
    return !!driver;
  }

  async isDrivingThisRide() {
    console.group("IS DRIVING THIS RIDE");
    let driverOnThisRide = null;

    const driver = await this.getDriver();
    if (driver) {
      driverOnThisRide = await Drivers.query()
        .where({
          driverId: driver.id,
          rideId: this.rideId,
        })
        .first();
    }
    console.log("DRIVER ON THIS RIDE", driverOnThisRide || "[NONE]");
    console.groupEnd();
    return !!driverOnThisRide;
  }

  async getRide() {
    console.group("GET RIDE");
    if (!this._ride) {
      console.log("MEMOIZE RIDE", this.rideId);
      this._ride = await Ride.query()
        .withGraphFetched("vehicle")
        .where("id", this.rideId)
        .first();
    }
    console.log(this._ride);
    console.groupEnd();
    return this._ride;
  }

  async getVehicle() {
    console.group("GET VEHICLE");
    const vehicle = (await this.getRide()).vehicle[0];
    console.groupEnd();
    return vehicle;
  }

  async isAuthorizedForVehicle() {
    console.group("IS AUTHORIZED FOR VEHICLE");
    const driver = await this.getDriver();
    const vehicle = await this.getVehicle();
    const authorization = await Authorization.query()
      .where({
        driverId: driver.id,
        vehicleId: vehicle.id,
      })
      .first();
    console.log("AUTHORIZATION", authorization || "[NONE]");
    console.groupEnd();
    return !!authorization;
  }

  async isPassenger() {
    console.group("IS PASSENGER");
    const passenger = await Passenger.query()
      .where({
        passengerId: this.userId,
        rideId: this.rideId,
      })
      .first();
    console.log("PASSENGER", passenger || "[NONE]");
    console.groupEnd();
    return !!passenger;
  }
}

module.exports = RideHelper;
