export default {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable(
      'MealOrders',
      {
        mealId: {
          type: Sequelize.UUID,
          references: {
            model: 'Meals',
            key: 'id',
          },
        },
        orderId: {
          type: Sequelize.UUID,
          references: {
            model: 'Orders',
            key: 'id',
          },
        },
        quantity: {
          type: Sequelize.INTEGER,
          allowNull: true,
          default: 1,
          validate: {
            isInt: true,
            min: 1
          }
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

  down: queryInterface => queryInterface.dropTable('MealOrders')
};
