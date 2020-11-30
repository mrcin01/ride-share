require("./db.js");

// Models
const User = require("./models/User");
const Ride = require("./models/Ride");
const Driver = require("./models/Driver.js");
const Passenger = require("./models/Passenger.js");
const Authorization = require("./models/Authorization.js");
const Drivers = require("./models/Drivers.js");

const RideHelper = require("./helpers/RideHelper");

// Hapi
const Joi = require("@hapi/joi"); // Input validation
const Hapi = require("@hapi/hapi"); // Server
const Vehicle = require("./models/Vehicle.js");

const server = Hapi.server({
  host: "localhost",
  port: 3000,
  routes: {
    cors: true,
  },
});

async function init() {
  // Show routes at startup.
  await server.register(require("blipp"));

  // Output logging information.
  await server.register({
    plugin: require("hapi-pino"),
    options: {
      prettyPrint: true,
    },
  });

  // Configure routes.
  server.route([
    {
      method: "POST",
      path: "/accounts",
      config: {
        description: "Sign up for an account",
        validate: {
          payload: Joi.object({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            phone: Joi.required(),
            email: Joi.string()
              .email()
              .required(),
            password: Joi.string().required(),
          }),
        },
      },
      handler: async (request) => {
        const existingAccount = await User.query()
          .where("email", request.payload.email)
          .first();
        if (existingAccount) {
          return {
            ok: false,
            msge: `Account with email '${request.payload.email}' is already in use`,
          };
        }

        const newAccount = await User.query().insert({
          firstName: request.payload.firstName,
          lastName: request.payload.lastName,
          email: request.payload.email,
          password: request.payload.password,
          phone: request.payload.phone,
          isAdmin: false,
          active: true,
        });

        if (newAccount) {
          return {
            ok: true,
            msge: `Created account '${request.payload.email}'`,
          };
        } else {
          return {
            ok: false,
            msge: `Couldn't create account with email '${request.payload.email}'`,
          };
        }
      },
    },

    {
      method: "GET",
      path: "/accounts",
      config: {
        description: "Retrieve all accounts",
      },
      handler: () => User.query(),
    },

    {
      method: "DELETE",
      path: "/accounts/{id}",
      config: {
        description: "Delete an account",
      },
      handler: (request) => {
        return User.query()
          .deleteById(request.params.id)
          .then((rowsDeleted) => {
            if (rowsDeleted === 1) {
              return {
                ok: true,
                msge: `Deleted account with ID '${request.params.id}'`,
              };
            } else {
              return {
                ok: false,
                msge: `Couldn't delete account with ID '${request.params.id}'`,
              };
            }
          });
      },
    },

    {
      method: "POST",
      path: "/login",
      config: {
        description: "Log in",
        validate: {
          payload: Joi.object({
            email: Joi.string()
              .email()
              .required(),
            password: Joi.string()
              .min(8)
              .required(),
          }),
        },
      },
      handler: async (request) => {
        console.log("USER BEING QUERYED");
        const user = await User.query()
          .where("email", request.payload.email)
          .first();
        if (user && (await user.verifyPassword(request.payload.password))) {
          return {
            ok: true,
            msge: `Logged in successfully as '${request.payload.email}'`,
            details: {
              id: user.id,
              firstName: user.first_name,
              lastName: user.last_name,
              email: user.email,
              isAdmin: user.isAdmin,
            },
          };
        } else {
          return {
            ok: false,
            msge: "Invalid email or password",
          };
        }
      },
    },

    {
      method: "GET",
      path: "/rides",
      config: {
        description: "Retrieve all rides",
      },
      handler: () =>
        Ride.query()
          .withGraphFetched("vehicle")
          .withGraphFetched("fromLocation")
          .withGraphFetched("toLocation")
          .withGraphFetched("passenger")
          .withGraphFetched("drivers"),
    },

    {
      method: "POST",
      path: "/passenger",
      config: {
        description: "Joining a ride by creating a passenger",
        validate: {
          payload: Joi.object({
            passengerId: Joi.required(),
            rideId: Joi.required(),
          }),
        },
      },
      handler: async (request) => {
        const helper = new RideHelper(
          request.payload.passengerId,
          request.payload.rideId
        );

        // Check whether this user is already a passenger.
        if (await helper.isPassenger()) {
          const msge = `Passenger already signed up for ride '${request.payload.passengerId}'`;
          console.log(msge);
          return {
            ok: false,
            msge: msge,
          };
        }

        // Check whether this driver is already signed up to drive this ride.
        if (await helper.isDrivingThisRide()) {
          const msge = `User '${await helper.getDriver().id}' already driving`;
          console.log(msge);
          return {
            ok: false,
            msge: msge,
          };
        }

        if (
          (await helper.isDriver()) &&
          (await helper.isAuthorizedForVehicle())
        ) {
          // This user is a driver and authorized to drive this vehicle.
          // Add user as driver.
          console.log("ADD DRIVER");
          const driver = await helper.getDriver();
          const newDrivers = await Drivers.query().insert({
            driverId: driver.id,
            rideId: request.payload.rideId,
          });
          console.log("NEW DRIVERS", newDrivers);

          if (newDrivers) {
            return {
              ok: true,
              msge: `Created drivers '${driver.id}'`,
            };
          } else {
            return {
              ok: false,
              msge: `Couldn't create drivers with id '${driver.id}'`,
            };
          }
        }

        // Sign up as a passenger.
        const newPassenger = await Passenger.query().insert({
          passengerId: request.payload.passengerId,
          rideId: request.payload.rideId,
        });

        if (newPassenger) {
          console.log("NEW PASSENGER", newPassenger);
          return {
            ok: true,
            msge: `Created passenger '${request.payload.passengerId}'`,
          };
        } else {
          console.error("COULDN'T CREATE NEW PASSENGER");
          return {
            ok: false,
            msge: `Couldn't create passenger with id '${request.payload.passengerId}'`,
          };
        }
      }, // End of handler
    }, // End of route config

    {
      method: "DELETE",
      path: "/passenger",
      config: {
        description: "Leaving a ride by deleting a passenger",
        validate: {
          payload: Joi.object({
            passengerId: Joi.required(),
            rideId: Joi.required(),
          }),
        },
      },
      handler: async (request) => {
        // Fetch the user's driver record, if any.
        const existingDriver = await Driver.query()
          .where("userId", request.payload.passengerId)
          .first();
        console.log("EXISTING DRIVER", existingDriver);
        const currentDriverId = existingDriver.id;
        console.log("DRIVER:", currentDriverId);

        // Retrieve details of the ride.
        const currentRide = await Ride.query()
          .withGraphFetched("vehicle")
          .where("id", request.payload.rideId)
          .first();
        console.log("CURRENT RIDE", currentRide);
        const currentVehicleId = currentRide.vehicle[0].id;
        console.log("CURRENT VEHICLE:", currentVehicleId);

        // Get authorization for this driver to drive this vehicle (if any).
        const authorized = await Authorization.query()
          .where("driverId", currentDriverId)
          .andWhere("vehicleId", currentVehicleId)
          .first();
        console.log("AUTHORIZED:", authorized);

        if (existingDriver && authorized) {
          const deletedDriver = await Drivers.query().delete().where("driverId", currentDriverId).andWhere("rideId", request.payload.rideId);
          console.log("DELETED DRIVERS", deletedDriver);

          if (deletedDriver) {
            return {
              ok: true,
              msge: `Deleted drivers '${deletedDriver}'`,
            };
          } else {
            return {
              ok: false,
              msge: `Couldn't delete drivers with id '${deletedDriver}'`,
            };
          }
        } else {
          console.log("NOT AUTHORIZED");
          const deletePassenger = await Passenger.query().delete().where("passengerId", request.payload.passengerId).andWhere("rideId", request.payload.rideId);

          if (deletePassenger) {
            console.log("DELETED PASSENGER", deletePassenger);
            return {
              ok: true,
              msge: `DELETED PASSENGER '${deletePassenger}'`,
            };
          } else {
            return {
              ok: false,
              msge: `Couldn't delete passenger with id '${deletePassenger}'`,
            };
          }
        }
        // eslint-disable-next-line no-unreachable
        console.error("SHOULDN'T GET HERE");
      }, // End of handler
    }, // End of route config

    {
      method: "POST",
      path: "/driver",
      config: {
        description: "Becoming a Driver",
        validate: {
          payload: Joi.object({
            userId: Joi.required(),
            licenseNumber: Joi.required(),
            licenseState: Joi.string().required(),
          }),
        },
      },
      handler: async (request) => {
        const existingDriver = await Driver.query()
          .where("userId", request.payload.userId)
          .first();
        if (existingDriver) {
          console.log(`User: '${request.payload.userId}' is already a driver`);
          return {
            ok: false,
            msge: `User: '${request.payload.userId}' is already a driver`,
          };
        }

        const newDriver = await Driver.query().insert({
          userId: request.payload.userId,
          licenseNumber: request.payload.licenseNumber,
          licenseState: request.payload.licenseState,
        });

        if (newDriver) {
          const userName = await User.query()
            .where("id", request.payload.userId)
            .first();
          return {
            ok: true,
            msge: `Created driver for user: ${userName.firstName}`,
          };
        } else {
          return {
            ok: false,
            msge: `Couldn't create Driver from user id '${request.payload.userId}'`,
          };
        }
      },
    },

    {
      method: "POST",
      path: "/createRide",
      config: {
        description: "Creates a New Ride",
        validate: {
          payload: Joi.object({
            date: Joi.string().required(),
            time: Joi.string().required(),
            distance: Joi.number().required(),
            fuelPrice: Joi.number().required(),
            fee: Joi.number().required(),
            vehicleModel: Joi.string().required(),
            fromLocation: Joi.string().required(),
            toLocation: Joi.string().required(),
          }),
        },
      },
      handler: async (request) => {
        console.log("PAYLOAD", request.payload);

        const vehicle = await Vehicle.query()
          .where("model", request.payload.vehicleModel)
          .first();
        if (vehicle){
          const currentVehicleId = vehicle.id;
        }
        else {
          return {
            ok: false,
            msge: `Vehicle Model: '${request.payload.vehicleModel}' does not exist`,
          };
        }

        const fromLocation = await Location.query()
          .where("name", request.payload.fromLocationName)
          .first();
        if (fromLocation){
          const currentFromLocationId = fromLocation.id;
        }
        else {
          return {
            ok: false,
            msge: `Location: '${request.payload.fromLocationName}' does not exist`,
          };
        }
        
        const toLocation = await Location.query()
          .where("name", request.payload.fromLocationName)
          .first();
        if (toLocation){
          const currentToLocationId = toLocation.id;
        }
        else {
          return {
            ok: false,
            msge: `Location: '${request.payload.toLocationName}' does not exist`,
          };
        }
        
        const existingRide = await Ride.query()
          .where("date", request.payload.date)
          .andWhere("time", request.payload.time)
          .andWhere("distance", request.payload.distance)
          .andWhere("fuelPrice", request.payload.fuelPrice)
          .andWhere("fee", request.payload.fee)
          .andWhere("vehicleId", currentVehicleId)
          .andWhere("fromLocationId", currentFromLocationId)
          .andWhere("toLocationId", currentToLocationId)
          .first();
        if (existingRide) {
          console.log(`Ride Already Exists`);
          return {
            ok: false,
            msge: `Ride Already Exists`,
          };
        }

        const newRide = await Driver.query().insert({
          date: request.payload.date,
          time: request.payload.time,
          distance: request.payload.distance,
          fuelPrice: request.payload.fuelPrice,
          fee: request.payload.fee,
          vehicleId: currentVehicleId,
          fromLocationId: currentFromLocationId,
          toLocationId: currentToLocationId,
        });

        if (newRide) {
          return {
            ok: true,
            msge: `Created new Ride`,
          };
        } else {
          return {
            ok: false,
            msge: `Couldn't create Ride`,
          };
        }
      },
    },
  ]);

  // Start the server.
  await server.start();
}

// Go!
init();
