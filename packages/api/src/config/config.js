const pg = require("pg");

module.exports = {
  development: {
    username: "ozimos",
    password: "root",
    database: "book_a_meal_dev",
    host: "127.0.0.1",
    dialect: "postgres",
    dialectModule: pg,
    // logging: false
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: "127.0.0.1",
    dialect: "postgres",
    dialectModule: pg,
    logging: false
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    dialectModule: pg
  }
};
