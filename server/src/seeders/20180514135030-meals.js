import { seedMeals } from '../../src/seedFiles';

export default {
  up: queryInterface => queryInterface.bulkInsert('Meals', seedMeals),

  down: queryInterface => queryInterface.bulkDelete('Meals', null),
  seedMeals
};
