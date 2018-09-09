export default (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    }
  });

  // Relations
  Order.associate = (models) => {
    Order.belongsTo(models.User, {
      foreignKey: 'userId',
    });
    Order.belongsToMany(models.Meal, {
      through: 'MealOrders',
      foreignKey: 'orderId',
      as: 'Meals',
    });
  };

  return Order;
};
