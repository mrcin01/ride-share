require("./db.js");

// Models
const User = require("./models/User");
const Ride = require("./models/Ride");
const Vehicle = require("./models/Vehicle.js");
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
            handler: async (request, h) => {
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
            handler: (request, h) => {
                return User.query();
            },
        },

        {
            method: "DELETE",
            path: "/accounts/{id}",
            config: {
                description: "Delete an account",
            },
            handler: (request, h) => {
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
            handler: async (request, h) => {
                console.log("USER BEING QUERYED");
                const user = await User.query()
                    .where("email", request.payload.email)
                    .first();
                if (
                    user &&
                    (await user.verifyPassword(request.payload.password))
                ) {
                    return {
                        ok: true,
                        msge: `Logged in successfully as '${request.payload.email}'`,
                        details: {
                            id: user.id,
                            firstName: user.first_name,
                            lastName: user.last_name,
                            email: user.email,
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
            handler: (request, h) => {
                return Ride.query()
                    .withGraphFetched("vehicle")
                    .withGraphFetched("fromLocation")
                    .withGraphFetched("toLocation")
                    .withGraphFetched("passenger")
                    .withGraphFetched("drivers")
                    .withGraphFetched("driver");
            },
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
            handler: async (request, h) => {
                const existingPassenger = await Passenger.query()
                    .where("passengerId", request.payload.passengerId)
                    .andWhere("rideId", request.payload.rideId)
                    .first();
                if (existingPassenger) {
                    console.log(
                        `Passenger already signed up for this ride '${request.payload.passengerId}' is already in use`
                    );
                    return {
                        ok: false,
                        msge: `Passenger already signed up for a ride '${request.payload.passengerId}' is already in use`,
                    };
                }

                const existingDriver = await Driver.query()
                    .where("userId", request.payload.passengerId)
                    .first();

                const currentRide = await Ride.query()
                    .withGraphFetched("vehicle")
                    .where("id", request.payload.rideId)
                    .first();

                if (existingDriver && currentRide) {
                    const currentDriverId = existingDriver.id;
                    const currentVehicleId = currentRide.vehicle[0].id;
                    console.log("DRIVER: ");
                    console.log(currentDriverId);
                    console.log("CURRENT VEHICLE: ");
                    console.log(currentVehicleId);
                    const authorized = await Authorization.query()
                        .where("driverId", currentDriverId)
                        .andWhere("vehicleId", currentVehicleId)
                        .first();
                    const existingDrivers = await Drivers.query()
                        .where("driverId", currentDriverId)
                        .andWhere("rideId", request.payload.rideId)
                        .first();
                    if (existingDrivers) {
                        console.log(
                            `Driver already signed up for this ride '${currentDriverId}' is already in use`
                        );
                        return {
                            ok: false,
                            msge: `Driver already signed up for this ride '${currentDriverId}' is already in use`,
                        };
                    }

                    if (authorized) {
                        const newDrivers = await Drivers.query().insert({
                            driverId: currentDriverId,
                            rideId: request.payload.rideId,
                        });

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
                    const newPassenger = await Passenger.query().insert({
                        passengerId: request.payload.passengerId,
                        rideId: request.payload.rideId,
                    });

                    if (newPassenger) {
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
            },
        },

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
            handler: async (request, h) => {
                const existingDriver = await Driver.query()
                    .where("userId", request.payload.userId)
                    .first();
                if (existingDriver) {
                    console.log(
                        `User: '${request.payload.userId}' is already a driver`
                    );
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
