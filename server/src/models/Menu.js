import {isBeforeCutoff} from "../controllers/util/menuMeal"

export default (sequelize, DataTypes) => {
  const Menu = sequelize.define(
    "Menu",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      menuDate: {
        allowNull: false,
        type: DataTypes.DATEONLY,
        defaultValue: new Date(),
        validate: {
          isBeforeCutoff
        }
      }
    }
  );

  // Relations
  Menu.associate = models => {
    Menu.belongsToMany(models.Meal, {
      through: "MealMenu",
      foreignKey: "menuId",
      as: "Meals"
    });
    Menu.belongsTo(models.User, {
      foreignKey: "userId",
      unique: "userTitle",
      onDelete: "CASCADE"
    });
    Menu.hasMany(models.MealMenu, {
      foreignKey: "menuId",
      onDelete: "CASCADE"
    });
  };
  return Menu;
};
