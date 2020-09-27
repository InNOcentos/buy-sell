'use strict';

module.exports = (sequelize, DataTypes) => {
    class Comment extends sequelize.Sequelize.Model{ }
    Comment.init({
      message: {
        type: DataTypes.STRING(300),
        allowNull: false,
      },
      createdAt: {
        field: `createdDate`,
        type: DataTypes.DATE
      },
    }, {
      sequelize,
      updatedAt: false,
      paranoid: false,
      modelName: `comment`,
    });
  
    return Comment;
};