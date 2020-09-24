'use strict';
const bcrypt = require(`bcrypt`);
const saltRounds = 10; 

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
            const hash = await bcrypt.hash(password, saltRounds);
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
                password: hash,
                avatar
            });
            return newUser;
        } catch (error) {
            console.error(`Can't create new user. Error: ${error}`);
            return false;
        }
    }
    async isExists(email) {
        const { User } = this._models;
        const userEmail = email.trim();
        try {
          const user = await User.findOne({
              where: {
                  email: userEmail
              }
          });
          return user;
        } catch (error) {
          console.error(`Can't check existence of user. Error: ${error}`);
    
          return null;
        }
    }
    async checkUser(user,password) {
      try {
        const match = await bcrypt.compare(password, user.dataValues.password);

        return match;
      } catch (error) {
        console.error(`Can't autheticate user. Error: ${error}`);

        return null;
      }
    }
}


module.exports = UserService;