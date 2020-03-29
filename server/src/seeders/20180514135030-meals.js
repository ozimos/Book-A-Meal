const { seedMeals } = require("../../src/seedFiles");

module.exports = {
  up: queryInterface => queryInterface.bulkInsert("Meals", seedMeals),

  down: queryInterface => queryInterface.bulkDelete("Meals", null),
  seedMeals
};
