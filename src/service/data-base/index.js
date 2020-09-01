'use strict';

const Sequelize = require(`sequelize`);
const path = require(`path`);
const config = require('../../config');

const sequelize = new Sequelize(config.db_name,config.db_user_name,config.db_user_password, {
    host: config.db_host,
    dialect: config.db_dialect,
});

const Category = require(path.join(__dirname,'./models/category'))(sequelize,Sequelize.DataTypes);
const Offer = require(path.join(__dirname,'./models/offer'))(sequelize,Sequelize.DataTypes);
const Comment = require(path.join(__dirname,'./models/comment'))(sequelize,Sequelize.DataTypes);
const Type = require(path.join(__dirname,'./models/type'))(sequelize,Sequelize.DataTypes);
const User = require(path.join(__dirname,'./models/user'))(sequelize,Sequelize.DataTypes);


// USERS

User.hasMany(Comment, {
    as: `comments`,
    foreignKey: `userId`
});
User.hasMany(Offer, {
    as: `offers`,
    foreignKey: `userId`
});

// OFFERS

Offer.belongsTo(User, {
    as: `user`,
    foreignKey: `userId`
});
Offer.belongsTo(Type, {
    as: `type`,
    foreignKey: `typeId`
});

Offer.belongsToMany(Category, {
    through: `offer_category`,
    as: `categories`,
    foreignKey: `offer_id`
});

Offer.hasMany(Comment, {
    as: `comments`,
    foreignKey: `offerId`
});

// CATEGORIES

Category.belongsToMany(Offer, {
    through: `offer_category`,
    as: `offers`,
    foreignKey: `category_id`,
    timestamps: false,
    paranoid: false,
});

//TYPES

Type.hasMany(Offer, {
    as: `offers`,
    foreignKey: `typeId`
});

// COMMENTS

Comment.belongsTo(User, {
    as: `user`,
    foreignKey: `userId`
});
Comment.belongsTo(Offer, {
    as: `offer`,
    foreignKey: `offerId`
});


const initDb = async () => {
    try {
        await sequelize.sync({ force: true});
        console.info(`Структура БД успешно создана.`);
    } catch (err) {
        console.error(`Не удалось создать таблицы в БД ${err}`);
    }

    await sequelize.close();
};

module.exports = {
    sequelize,
    initDb
}
