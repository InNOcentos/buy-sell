'use strict';

module.exports = (sequelize, DataTypes) => {
    class User extends sequelize.Sequelize.Model{ }
    User.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        firstname: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        avatar: {
          type: DataTypes.TEXT
        }
    }, {
        sequelize,
        timestamps: false,
        paranoid: false,
        modelName: 'user'
    });

    return User;
};