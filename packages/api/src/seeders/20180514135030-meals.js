const { seedMeals } = require("../seedFiles");

module.exports = {
  up: queryInterface => queryInterface.bulkInsert("Meals", seedMeals),

  down: queryInterface => queryInterface.bulkDelete("Meals", null),
  seedMeals
};
