import { seedMenus } from '../../src/seedFiles';

export default {
  up: queryInterface => queryInterface.bulkInsert('Menus', seedMenus),

  down: queryInterface => queryInterface.bulkDelete('Menus', null),
  seedMenus
};
