
export default (sequelize, DataTypes) => {

  const Menu = sequelize.define('Menu', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    menuDate: {
      allowNull: false,
      type: DataTypes.DATEONLY,
      defaultValue: new Date().setHours(0, 0, 0, 0, 0)
    }
  });

  // Relations
  Menu.associate = (models) => {
    Menu.belongsToMany(models.Meal, {
      through: 'MealMenus',
      foreignKey: 'menuId',
      as: 'Meals',
    });
    Menu.belongsTo(models.User, {
      foreignKey: 'userId',
      unique: 'userTitle',
      onDelete: 'CASCADE'
    });
  };
  return Menu;
};
