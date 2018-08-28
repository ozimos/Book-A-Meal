export default (sequelize, DataTypes) => {
  const MealMenus = sequelize.define(
    'MealMenus', {
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          isUUID: 4
        }
      }
    },
    {
      validate: {
        matchUserIds() {
          if (this.mealId) {
            return sequelize.model('Meal')
              .find({ where: { id: this.mealId }, attributes: ['userId'] })
              .then((Meal) => {
                if (this.userId !== Meal.userId) {
                  throw new Error(`You can only add your meals to the menu.
                   Meal id: ${this.mealId} does not belong to this user`);
                }
              });
          }
        }
      }
    }
  );
  return MealMenus;
};
