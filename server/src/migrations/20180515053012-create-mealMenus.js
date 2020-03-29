module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable("MealMenus", {
      mealId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "Meals",
          key: "id"
        }
      },
      menuId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "Menus",
          key: "id"
        }
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW")
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW")
      }
    }),

  down: queryInterface => queryInterface.dropTable("MealMenus")
};
