require("./db.js");

// Models
const User = require("./models/User");
const Ride = require("./models/Ride");
const Driver = require("./models/Driver.js");
const Passenger = require("./models/Passenger.js");
const Authorization = require("./models/Authorization.js");
const Drivers = require("./models/Drivers.js");

// Hapi
const Joi = require("@hapi/joi"); // Input validation
const Hapi = require("@hapi/hapi"); // Server

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
        // Check whether this user is already a passenger.
        const existingPassenger = await Passenger.query()
          .where("passengerId", request.payload.passengerId)
          .andWhere("rideId", request.payload.rideId)
          .first();
        if (existingPassenger) {
          const msge = `Passenger already signed up for this ride '${request.payload.passengerId}' is already in use`;
          console.log(msge);
          return {
            ok: false,
            msge: msge,
          };
        }

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
          // This user is a driver and authorized to drive this vehicle.

          // See whether this driver is already signed up to drive this ride.
          const existingDrivers = await Drivers.query()
            .where("driverId", currentDriverId)
            .andWhere("rideId", request.payload.rideId)
            .first();
          console.log("EXISTING DRIVERS:", existingDrivers);

          // The user is already driving this ride.
          if (existingDrivers) {
            const msge = `Driver already signed up for this ride '${currentDriverId}' is already in use`;
            console.log(msge);
            return {
              ok: false,
              msge: msge,
            };
          }

          // The user is authorized to drive the vehicle for this ride.
          if (authorized) {
            // Add user as driver.
            const newDrivers = await Drivers.query().insert({
              driverId: currentDriverId,
              rideId: request.payload.rideId,
            });
            console.log("NEW DRIVERS", newDrivers);

            if (newDrivers) {
              return {
                ok: true,
                msge: `Created drivers '${currentDriverId}'`,
              };
            } else {
              return {
                ok: false,
                msge: `Couldn't create drivers with id '${currentDriverId}'`,
              };
            }
          }
        } else {
          // The user is not a driver. Sign up as a passenger.
          console.log("NOT AUTHORIZED");
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
            return {
              ok: false,
              msge: `Couldn't create passenger with id '${request.payload.passengerId}'`,
            };
          }
        }
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
  ]);

  // Start the server.
  await server.start();
}

// Go!
init();
