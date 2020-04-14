const { seedMealMenus } = require('../seedFiles');

module.exports = {
    up: (queryInterface) => queryInterface.bulkInsert('MealMenus', seedMealMenus),

    down: (queryInterface) => queryInterface.bulkDelete('MealMenus', null),
    seedMealMenus,
};
