import { seedMealMenus } from '../../src/seedFiles';

export default {
  up: queryInterface => queryInterface.bulkInsert('MealMenus', seedMealMenus),

  down: queryInterface => queryInterface.bulkDelete('MealMenus', null),
  seedMealMenus
};
