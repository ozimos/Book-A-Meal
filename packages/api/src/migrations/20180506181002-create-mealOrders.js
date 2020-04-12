module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable("MealOrders", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      mealId: {
        type: Sequelize.UUID,
        references: {
          model: "Meals",
          key: "id"
        }
      },
      orderId: {
        type: Sequelize.UUID,
        references: {
          model: "Orders",
          key: "id"
        },
        onDelete: "cascade"
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: true,
        default: 1,
        validate: {
          isInt: true,
          min: 1
        }
      }
    }),

  down: queryInterface => queryInterface.dropTable("MealOrders")
};
