
export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Meals', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      userId: {
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id',
          as: 'userId',
          onDelete: 'CASCADE'
        },
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: 'title'
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      imageUrl: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      }
    });
    await queryInterface.addConstraint(
      'Meals', ['title', 'userId', 'deletedAt'],
      {
        type: 'unique',
        name: 'userTitle'
      }
    );
  },

  down: queryInterface => queryInterface.dropTable('Meals')
};