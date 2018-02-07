const path = require('path');

const BASE_PATH = path.join(__dirname, 'feat', 'server', 'db');

module.exports = {
  test: {
    client: 'pg',
    connection: 'postgres://jamesw:null@localhost:5432/user_region_test',
    migrations: {
      directory: path.join(BASE_PATH, 'migrations')
    },
    seeds: {
      directory: path.join(BASE_PATH, 'seeds')
    }
  },
  development: {
    client: 'pg',
    connection: 'postgres://jamesw:null@localhost:5432/user_region',
    migrations: {
      directory: path.join(BASE_PATH, 'migrations')
    },
    seeds: {
      directory: path.join(BASE_PATH, 'seeds')
    }
  }
};