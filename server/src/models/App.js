export default (sequelize, DataTypes) => {
  const App = sequelize.define(
    "App",
    {
      hour: {
        type: DataTypes.INTEGER,
        defaultValue: 12,
        validate: {
          max: 23
        }
      },
      min: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          max: 59
        }
      },
      sec: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          max: 59
        }
      },
      tempMenu: {
        type: DataTypes.UUIDV4,
        allowNull: true
      }
    },
    {
      timestamps: false
    }
  );

  return App;
};
