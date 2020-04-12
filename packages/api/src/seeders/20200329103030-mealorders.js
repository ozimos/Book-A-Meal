const { seedMealOrders } = require("../seedFiles");

module.exports = {
  up: (queryInterface) =>
    queryInterface.bulkInsert("MealOrders", seedMealOrders),

  down: (queryInterface) => queryInterface.bulkDelete("MealOrders", null),
};
