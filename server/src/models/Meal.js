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
    tags: {
      type: DataTypes.ARRAY(Sequelize.STRING),
      allowNull: true,
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
      fields: ['title', 'deletedAt', 'userId'q]
    }],
  });

  Meal.associate = (models) => {
    Meal.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Meal.hasMany(models.MealMenu, {
      foreignKey: 'mealId',
      onDelete: 'CASCADE'
    });
    Meal.belongsToMany(models.Menu, {
      through: 'MealMenu',
      foreignKey: 'mealId',
      as: 'Menus',
    });
    Meal.belongsToMany(models.Order, {
      through: 'MealOrder',
      foreignKey: 'mealId',
      as: 'Orders',
    });
  };

  return Meal;
};
