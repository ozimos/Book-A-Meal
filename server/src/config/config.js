import * as pg from 'pg';

export default {
  development: {
    username: 'root',
    password: 'password',
    database: 'BookAMeal_development',
    host: '127.0.0.1',
    dialect: 'postgres',
    dialectModule: pg,
    // logging: false
  },
  test: {
    username: 'travis',
    password: 'travis',
    database: 'travis',
    host: '127.0.0.1',
    dialect: 'postgres',
    dialectModule: pg,
    logging: false
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    dialectModule: pg,
  }
};
