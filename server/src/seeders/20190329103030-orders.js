const { seedOrders } = require("../seedFiles");

module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert("Orders", seedOrders),

  down: (queryInterface) => queryInterface.bulkDelete("Orders", null),
};
