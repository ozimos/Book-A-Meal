module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('MealMenus', {
            id: {
                type: Sequelize.UUID,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,
            },
            mealId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            menuId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
        });
        await queryInterface.addConstraint('MealMenus', ['mealId', 'menuId'], {
            type: 'unique',
            name: 'mealMenu',
        });
        await queryInterface.sequelize
            .query(`CREATE OR REPLACE FUNCTION mealmenufunc() RETURNS TRIGGER AS 
    $logic$
    DECLARE
   "menuUserId" uuid;
   "mealUserId" uuid;
    BEGIN
    SELECT "userId" INTO "menuUserId" FROM "Menus" WHERE id = NEW."menuId";
    SELECT "userId" INTO "mealUserId" FROM "Meals" WHERE id = NEW."mealId";
       IF ("menuUserId"<>"mealUserId")  THEN
            RAISE EXCEPTION 'userId fields on meal and menu do not match';
      END IF;
      RETURN NEW;
    END;
    $logic$ 
    LANGUAGE plpgsql;
    CREATE TRIGGER every_menu_meals 
    BEFORE INSERT OR UPDATE OR DELETE
    ON "MealMenus" 
    FOR EACH ROW EXECUTE PROCEDURE mealmenufunc();
    `);
    },

    down: (queryInterface) => queryInterface.dropTable('MealMenus'),
};
