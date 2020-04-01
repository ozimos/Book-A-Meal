module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Menus", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      userId: {
        type: Sequelize.UUID,
        references: {
          model: "Users",
          key: "id",
          as: "userId",
          onDelete: "cascade"
        }
      },
      menuDate: {
        allowNull: false,
        type: Sequelize.DATEONLY,
        defaultValue: new Date().setHours(0, 0, 0, 0, 0)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW")
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW")
      }
    });
    
    await queryInterface.addConstraint("Menus", ["userId", "id"], {
      type: "unique",
      name: "menuUser"
    });
  },

  down: queryInterface => queryInterface.dropTable("Menus")
};
