module.exports = {
    up: (queryInterface, Sequelize) =>
        queryInterface.createTable('Menus', {
            id: {
                type: Sequelize.UUID,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,
            },
            userId: {
                type: Sequelize.UUID,
                references: {
                    model: 'Users',
                    key: 'id',
                    as: 'userId',
                    onDelete: 'cascade',
                },
            },
            menuDate: {
                allowNull: false,
                type: Sequelize.DATEONLY,
                defaultValue: new Date(),
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW'),
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW'),
            },
        }),
    down: (queryInterface) => queryInterface.dropTable('Menus'),
};
