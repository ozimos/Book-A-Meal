export default (sequelize, DataTypes) => {
  const Order = sequelize.define(
    "Order",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
    },
    {
      defaultScope: {
        where: {},
        attributes: ["id", "userId", "updatedAt"],
        order: [["updatedAt", "DESC"]],
        rejectOnEmpty: true,
        include: [
          {
            association: "Meals",
            where: {},
            distinct: true,
            paranoid: false,
            attributes: [
              [
                sequelize.literal(
                  '"Meals"."price" * "Meals->MealOrder"."quantity"'
                ),
                "subTotal",
              ],
              "price",
              "id",
            ],
            through: {
              attributes: ["quantity"],
            },
          },
          {
            association: "User",
            attributes: ["firstName", "lastName", "email"],
          },
        ],
      },
      scopes: {
        accessMode(asCaterer, userId) {
          return asCaterer
            ? {
                include: [
                  {
                    association: "Meals",
                    where: { userId },
                  },
                ],
              }
            : { where: { userId } };
        },
        updatedAt(start, end) {
          return { where: { updatedAt: { [Op.between]: [start, end] } } };
        },
      },
    }
  );

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
