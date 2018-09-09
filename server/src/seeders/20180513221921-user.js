import { seedUsers } from '../../src/seedFiles';


export default {
  up: queryInterface => queryInterface.bulkInsert('Users', seedUsers),

  down: queryInterface => queryInterface.bulkDelete('Users', null),
  seedUsers
};
