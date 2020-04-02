module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable("App", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      hour: {
        type: Sequelize.INTEGER,
        defaultValue: 12
      },
      min: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      sec: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      tempMenu: {
        type: Sequelize.UUIDV4,
        allowNull: true
      }
    }),
  down: queryInterface => queryInterface.dropTable("App")
};
