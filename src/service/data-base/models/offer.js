"use strict";

module.exports = (sequelize, DataTypes) => {
  class Offer extends sequelize.Sequelize.Model {}
  Offer.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.TEXT,
      },
      sum: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATEONLY,
        field: 'created_date'
      }
    },
    {
      sequelize,
      timestamps: false,
      paranoid: false,
      modelName: 'offer',
    }
  );

  return Offer;
};
