module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("MealMenus", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      mealId: {
        type: Sequelize.UUID,
        allowNull: false
      },
      menuId: {
        type: Sequelize.UUID,
        allowNull: false
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false
      }
    });
    await queryInterface.addConstraint("MealMenus", ["mealId", "menuId"], {
      type: "unique",
      name: "mealMenu"
    });
    await queryInterface.sequelize.query(`ALTER TABLE IF EXISTS MealMenus
    ADD CONSTRAINT "MealMenus_Meals_fkey"
    FOREIGN KEY (mealId, userId)
    REFERENCES Meals(id, userId) ON DELETE CASCADE`);
    await queryInterface.sequelize.query(`ALTER TABLE IF EXISTS MealMenus
    ADD CONSTRAINT "MealMenus_Menus_fkey"
    FOREIGN KEY (menuId, userId)
    REFERENCES Menus(id, userId) ON DELETE CASCADE`);
  },

  down: queryInterface => queryInterface.dropTable("MealMenus")
};
