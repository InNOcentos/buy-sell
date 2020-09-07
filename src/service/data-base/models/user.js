"use strict";

module.exports = (sequelize, DataTypes) => {
  class User extends sequelize.Sequelize.Model {}
  User.init({
    firstName: {
      type: DataTypes.STRING(50),
      field: `firstName`,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(50),
      field: `lastName`,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(320),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    avatar: {
      type: DataTypes.TEXT,
    },
  }, {
    sequelize,
    timestamps: false,
    paranoid: false,
    modelName: `user`,
  });

  return User;
};
