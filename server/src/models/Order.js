export default (sequelize, DataTypes) => {
  const Order = sequelize.define("Order", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
  });

  // Relations
  Order.associate = (models) => {
    Order.belongsTo(models.User, {
      as: "User",
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
    Order.belongsToMany(models.Meal, {
      through: "MealOrder",
      foreignKey: "orderId",
      as: "Meals",
    });
    Order.hasMany(models.MealOrder, {
      foreignKey: "orderId",
      onDelete: "CASCADE",
    });
  };

  return Order;
};
