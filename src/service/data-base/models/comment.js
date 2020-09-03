'use strict';

module.exports = (sequelize, DataTypes) => {
    class Comment extends sequelize.Sequelize.Model{ }
    Comment.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        message: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        createdAt: {
          type: DataTypes.DATEONLY,
          field: `createdDate`
        }
    }, {
        sequelize,
        updatedAt: false,
        paranoid: false,
        modelName: 'comment'
    });

    return Comment;
};