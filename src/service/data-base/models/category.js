'use strict';

module.exports = (sequelize, DataTypes) => {
    class Category extends sequelize.Sequelize.Model{ }
    Category.init({
        title: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
      }, {
        sequelize,
        timestamps: false,
        paranoid: false,
        modelName: `category`,
      });
    
      return Category;
};