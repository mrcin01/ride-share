// Knex
const { knex, Model } = require("./db.js");

// Models
const User = require("./models/User");

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
            email: Joi.string().email().required(),
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
      method: "PATCH",
      path: "/deactivate/{id}",
      config: {
        description: "Deactivate an account",
        validate: {
          payload: Joi.object({
            active: Joi.required(),
          }),
        },
      },
      handler: async (request, h) => {
        const user = await User.query()
          .where({id: request.params.id})
          .update(request.payload.active);
        if (user) {
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
      },
    },

    {
      method: "POST",
      path: "/login",
      config: {
        description: "Log in",
        validate: {
          payload: Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(8).required(),
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
  ]);

  // Start the server.
  await server.start();
}

// Go!
init();

  