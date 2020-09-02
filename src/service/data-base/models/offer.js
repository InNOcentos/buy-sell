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
      type: {
        type: sequelize.Sequelize.ENUM,
        values: [`buy`, `sell`],
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        field: `createdDate`,
        type: DataTypes.DATEONLY,
      }
    },
    {
      sequelize,
      updatedAt: false,
      paranoid: false,
      modelName: 'offer',
    }
  );

  return Offer;
};
