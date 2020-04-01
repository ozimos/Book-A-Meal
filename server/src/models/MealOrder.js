export default (sequelize, DataTypes) => {

  const MealOrder = sequelize.define('MealOrder', {
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

  return MealOrder;
};
