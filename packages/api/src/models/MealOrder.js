export default (sequelize, DataTypes) => {
  const MealOrder = sequelize.define(
    "MealOrder",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
        default: 1,
        validate: {
          isInt: true,
          min: 1,
        },
      },
    },
    { timestamps: false }
  );
  MealOrder.associate = (models) => {
    MealOrder.belongsTo(models.Meal, {
      foreignKey: "mealId",
      onDelete: "CASCADE",
      as: "Meal",
    });
    MealOrder.belongsTo(models.Order, {
      foreignKey: "orderId",
      onDelete: "CASCADE",
      as: "Order",
    });
  };
  return MealOrder;
};
