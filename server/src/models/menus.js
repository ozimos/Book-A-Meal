
export default (sequelize, DataTypes) => {
  const Menu = sequelize.define(
    'Menu', {
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
    },
    {
      scopes: {
        forCaterers(userId) {
          return {
            include: [{
              association: 'Meals',
              required: false,
              where: { userId },
              through: {
                attributes: []
              }
            }]
          };
        },
        forNonCaterers() {
          return {
            include: [{
              association: 'Meals',
              required: false,
              through: {
                attributes: []
              }
            }]
          };
        }
      }
    }
  );

  // Relations
  Menu.associate = (models) => {
    Menu.belongsToMany(models.Meal, {
      through: 'MealMenus',
      foreignKey: 'menuId',
      as: 'Meals',
    });
  };
  return Menu;
};
