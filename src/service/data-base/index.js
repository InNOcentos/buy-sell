'use strict';

const Sequelize = require(`sequelize`);
const path = require(`path`);
const config = require('../../config');
const {ExitCode} = require('../../constants');

const sequelize = new Sequelize(config.db_name,config.db_user_name,config.db_user_password, {
    host: config.db_host,
    dialect: config.db_dialect,
});

const initDb = async () => {
    try {
        await sequelize.sync();
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
