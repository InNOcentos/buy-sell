'use strict';

class UserService {
    constructor(dataBase) {
        const { sequelize, models } = dataBase;
        const { User } = models;
        this._database = dataBase,
        this._models = models
    }
    async add({firstName, lastName, email, password, avatar}) {
        try {
            const { User } = this._models;
            const lastId = await User.findAll({
                limit: 1,
                order: [ [ 'id', 'DESC' ]],
                attributes: [
                  `id`
                ]
              });
            const newId = Number.parseInt(lastId[0]['dataValues']['id'], 10) + 1;
            const newUser = await User.create({
                id: newId,
                firstName,
                lastName,
                email,
                password,
                avatar
            });
            return newUser;
        } catch (error) {
            console.error(`Can't create new user. Error: ${error}`);
            return false;
        }
    }
}


module.exports = UserService;