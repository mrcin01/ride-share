const Passenger = require("../../models/Passenger");
const Driver = require("../../models/Driver");
const Drivers = require("../../models/Drivers");
const Ride = require("../../models/Ride");
const Authorization = require("../../models/Authorization");

class RideHelper {
  constructor(userId, rideId) {
    this.userId = userId;
    this.rideId = rideId;
  }

  async getDriver() {
    return await Driver.query()
      .where("userId", this.userId)
      .first();
  }

  isDriver() {
    const driver = this.getDriver();
    return !!driver;
  }

  async isDrivingThisRide() {
    const driver = this.getDriver();
    if (driver) {
      const existingDriver = await Drivers.query()
        .where({ driverId: driver.id, rideId: this.rideId })
        .first();
      return !!existingDriver;
    }
    return false;
  }

  async getRide() {
    if (!this._ride) {
      this._ride = await Ride.query()
        .withGraphFetched("vehicle")
        .where("id", this.rideId)
        .first();
    }
    return this._ride;
  }

  async getVehicle() {
    this.getRide().vehicle[0];
  }

  async isAuthorizedToDrive() {
    const authorized = await Authorization.query()
      .where({ driverId: this.getDriver().id, vehicleId: this.getVehicle().id })
      .first();
    return !!authorized;
  }

  async isPassenger() {
    const passenger = await Passenger.query()
      .where({ passengerId: this.userId, rideId: this.rideId })
      .first();
    return !!passenger;
  }
}

module.exports = RideHelper;
