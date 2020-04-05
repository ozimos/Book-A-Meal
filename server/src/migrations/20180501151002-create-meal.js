module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Meals", {
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
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: "title"
      },
      tags: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      imageUrl: {
        type: Sequelize.STRING,
        allowNull: false
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false
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
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
   await queryInterface.sequelize.query(
      `CREATE UNIQUE INDEX "userTitle3" ON "Meals" ("title", "deletedAt", "userId")
        WHERE "deletedAt" IS NOT NULL;
      CREATE UNIQUE INDEX "userTitle2" ON "Meals" ("title", "userId")
      WHERE "deletedAt" IS NULL;`);
  },

  down: queryInterface => queryInterface.dropTable("Meals")
};
