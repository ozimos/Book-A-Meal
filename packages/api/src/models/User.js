import bcrypt from 'bcryptjs';

const hashPassword = user =>
  bcrypt.hash(user.password, 10)
    .then(hash =>
      user.setDataValue('password', hash));

export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'email'
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false

    },
    isCaterer: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  });

  User.beforeCreate(hashPassword);

  return User;
};
