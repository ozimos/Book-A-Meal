import formatISO from 'date-fns/formatISO';
import { Op } from 'sequelize';

function isBeforeCutoff(menuDate) {
    const menuCutOffHour = process.env.MENU_CUTOFF_HOUR;
    const menuCutOffMinute = process.env.MENU_CUTOFF_MINUTE;
    const menuCutOffTime = new Date(menuDate).setHours(menuCutOffHour, menuCutOffMinute, 0, 0);
    if (menuCutOffTime - new Date() < 0) {
        throw new Error(
            `This menu can only be posted before ${formatISO(
                menuCutOffTime,
            )} for the input menuDate`,
        );
    }
}

export default (sequelize, DataTypes) => {
    const Menu = sequelize.define(
        'Menu',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            menuDate: {
                allowNull: false,
                type: DataTypes.DATEONLY,
                defaultValue: new Date(),
                validate: {
                    isBeforeCutoff,
                },
            },
        },
        {
            scopes: {
                accessMode(asCaterer, userId) {
                    return asCaterer ? { where: { userId } } : {};
                },
                discriminatingDate(hasDateRange, start, end) {
                    return hasDateRange
                        ? {
                              where: {
                                  menuDate: { [Op.gte]: start, [Op.lt]: end },
                              },
                          }
                        : {};
                },
                forId(id) {
                    return { where: { id } };
                },
                basic: {
                    rejectOnEmpty: true,
                    attributes: ['id', 'menuDate'],
                    include: [
                        {
                            association: 'Meals',
                            attributes: {
                                exclude: ['createdAt', 'deletedAt', 'updatedAt'],
                            },
                            required: true,
                            through: { attributes: [] },
                        },
                    ],
                },
            },
        },
    );

    // Relations
    Menu.associate = (models) => {
        Menu.belongsToMany(models.Meal, {
            through: 'MealMenu',
            foreignKey: 'menuId',
            as: 'Meals',
        });
        Menu.belongsTo(models.User, {
            foreignKey: 'userId',
            unique: 'userTitle',
            onDelete: 'CASCADE',
        });
        Menu.hasMany(models.MealMenu, {
            foreignKey: 'menuId',
            onDelete: 'CASCADE',
        });
    };
    return Menu;
};
