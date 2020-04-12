const { allSeedUsers } = require("../seedFiles");

module.exports = {
  up: queryInterface => queryInterface.bulkInsert("Users", allSeedUsers),

  down: queryInterface => queryInterface.bulkDelete("Users", null)
};
