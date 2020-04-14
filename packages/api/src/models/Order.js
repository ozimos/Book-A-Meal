import Sequelize, { Op } from 'sequelize';

export default (sequelize, DataTypes) => {
    const Order = sequelize.define(
        'Order',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
        },
        {
            scopes: {
                accessMode(asCaterer, userId) {
                    return asCaterer
                        ? {
                              include: [
                                  {
                                      association: 'Meals',
                                      where: { userId },
                                  },
                              ],
                          }
                        : { where: { userId } };
                },
                discriminatingDate(hasDateRange, start, end) {
                    return hasDateRange
                        ? {
                              where: {
                                  updatedAt: { [Op.between]: [start, end] },
                              },
                          }
                        : {};
                },
                forId(id) {
                    return { where: { id } };
                },
                basic: {
                    attributes: [],
                    include: [
                        {
                            association: 'Meals',
                            paranoid: false,
                            attributes: [
                                [
                                    Sequelize.literal(
                                        '"Meals"."price" * "Meals->MealOrder"."quantity"',
                                    ),
                                    'subTotal',
                                ],
                            ],
                            through: {
                                attributes: [],
                            },
                        },
                    ],
                },
                allWithCount: {
                    attributes: ['id', 'userId', 'updatedAt'],
                    order: [['updatedAt', 'DESC']],
                    include: [
                        {
                            association: 'Meals',
                            distinct: true,
                            attributes: ['price', 'id'],
                            through: {
                                attributes: ['quantity'],
                            },
                        },
                    ],
                },
                orderDetail: {
                    include: [
                        {
                            association: 'Meals',
                            attributes: ['userId', 'title', 'description', 'updatedAt'],
                        },
                        {
                            association: 'User',
                            attributes: ['firstName', 'lastName', 'email'],
                        },
                    ],
                },
            },
        },
    );

    // Relations
    Order.associate = (models) => {
        Order.belongsTo(models.User, {
            as: 'User',
            foreignKey: 'userId',
            onDelete: 'CASCADE',
        });
        Order.belongsToMany(models.Meal, {
            through: 'MealOrder',
            foreignKey: 'orderId',
            as: 'Meals',
        });
        Order.hasMany(models.MealOrder, {
            foreignKey: 'orderId',
            onDelete: 'CASCADE',
        });
    };

    return Order;
};
