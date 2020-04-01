export default (sequelize, DataTypes) => {
  const MealMenu = sequelize.define(
    "MealMenu",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      }
    },
    { timestamps: false }
  );
  MealMenu.associate = models => {
    MealMenu.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });
    MealMenu.belongsTo(models.Meal, {
      foreignKey: "mealId",
      onDelete: "CASCADE"
    });
    MealMenu.belongsTo(models.Menu, {
      foreignKey: "menuId",
      onDelete: "CASCADE"
    });
  };
  return MealMenu;
};
