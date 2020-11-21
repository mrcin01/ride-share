// Knex
const knex = require("knex")({
    client: "pg",
    connection: {
      host: "faraday.cse.taylor.edu", // PostgreSQL server
      user: "matthew_bouch", // Your user name
      password: "tupaguha", // Your password
      database: "matthew_bouch", // Your database name
    },
  });
  
  // Objection
  const objection = require("objection");
  objection.Model.knex(knex);
  
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
              email: Joi.string().email().required(),
              password: Joi.string().required(),
            }),
          },
        },
        handler: async (request, h) => {
          const existingUser = await User.query()
            .where("email", request.payload.email)
            .first();
          if (existingUser) {
            return {
              ok: false,
              msge: `Account with email '${request.payload.email}' is already in use`,
            };
          }
  
          const newAccount = await Account.query().insert({
            first_name: request.payload.firstName,
            last_name: request.payload.lastName,
            email: request.payload.email,
            password: request.payload.password,
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
          return Account.query()
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
              email: Joi.string().email().required(),
              password: Joi.string().min(8).required(),
            }),
          },
        },
        handler: async (request, h) => {
          const account = await Account.query()
            .where("email", request.payload.email)
            .first();
          if (
            account &&
            (await account.verifyPassword(request.payload.password))
          ) {
            return {
              ok: true,
              msge: `Logged in successfully as '${request.payload.email}'`,
              details: {
                id: account.id,
                firstName: account.first_name,
                lastName: account.last_name,
                email: account.email,
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
  
  process.on("unhandledRejection", (err) => {
    server.logger().error(err);
    process.exit(1);
  });
  
  // Go!
  init();
  