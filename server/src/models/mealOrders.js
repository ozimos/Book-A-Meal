export default (sequelize, DataTypes) => {

  const MealOrders = sequelize.define('MealOrders', {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
      default: 1,
      validate: {
        isInt: true,
        min: 1
      }
    }
  });

  return MealOrders;
};
