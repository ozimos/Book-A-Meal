export default (sequelize, DataTypes) => {
  const Meal = sequelize.define('Meal', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    timestamps: true,
    paranoid: true,
    indexes: [{
      unique: true,
      fields: ['title', 'userId', 'deletedAt']
    }],
  });

  // Relations
  Meal.associate = (models) => {
    Meal.belongsTo(models.User, {
      foreignKey: 'userId',
      unique: 'userTitle',
      onDelete: 'CASCADE'
    });
    Meal.belongsToMany(models.Menu, {
      through: 'MealMenus',
      foreignKey: 'mealId',
      as: 'Menus',
    });
    Meal.belongsToMany(models.Order, {
      through: 'MealOrders',
      foreignKey: 'mealId',
      as: 'Orders',
    });
  };

  return Meal;
};
