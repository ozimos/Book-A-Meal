export default {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable(
      'Menus',
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4
        },
        menuDate: {
          allowNull: false,
          type: Sequelize.DATEONLY,
          defaultValue: new Date().setHours(0, 0, 0, 0, 0)
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn('NOW')
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn('NOW')
        }
      }
    ),

  down: queryInterface => queryInterface.dropTable('Menus')
};
