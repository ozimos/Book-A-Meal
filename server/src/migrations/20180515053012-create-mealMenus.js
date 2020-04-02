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
      }
    });
    await queryInterface.addConstraint("MealMenus", ["mealId", "menuId"], {
      type: "unique",
      name: "mealMenu"
    });
    await queryInterface.sequelize.query(`CREATE OR REPLACE FUNCTION mealmenufunc() RETURNS TRIGGER AS 
    $logic$
    BEGIN
       SELECT userId AS menuUserId, menuDate FROM Menus WHERE id = NEW.menuId;
       SELECT userId AS mealUserId FROM Meals WHERE id = NEW.menuId;
       IF (menuUserId=mealUserId)  THEN
            RAISE EXCEPTION "A caterer's meals cannot be added to a different caterer's menu";
      END IF;
      RETURN NEW;
    END;
    $logic$ 
    LANGUAGE plpgsql;
    CREATE OR REPLACE FUNCTION mealmenustatement() RETURNS TRIGGER AS 
    $logic$
    BEGIN
      UPDATE Menus SET updatedAt = CURRENT_TIMESTAMP WHERE id = ;
      RETURN NULL;
    END;
    $logic$ 
    LANGUAGE plpgsql;
    CREATE TRIGGER every_menu_meals 
    BEFORE INSERT OR UPDATE OR DELETE OR TRUNCATE
    ON MealMenus 
    FOR EACH ROW EXECUTE PROCEDURE mealmenufunc();
    CREATE TRIGGER menu_meals 
    `);
  },

  down: queryInterface => queryInterface.dropTable("MealMenus")
};
