const { seedMenus } = require("../seedFiles");

module.exports = {
  up: queryInterface => queryInterface.bulkInsert("Menus", seedMenus),

  down: queryInterface => queryInterface.bulkDelete("Menus", null),
  seedMenus
};
