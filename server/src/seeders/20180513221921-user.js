const { seedUsers } = require("../../src/seedFiles");

module.exports = {
  up: queryInterface => queryInterface.bulkInsert("Users", seedUsers),

  down: queryInterface => queryInterface.bulkDelete("Users", null),
  seedUsers
};
