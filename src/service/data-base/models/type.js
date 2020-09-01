'use strict';

module.exports = (sequelize, DataTypes) => {
    class Type extends sequelize.Sequelize.Model{ }
    Type.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        }
    }, {
        sequelize,
        timestamps: false,
        paranoid: false,
        modelName: 'type'
    });

    return Type;
};