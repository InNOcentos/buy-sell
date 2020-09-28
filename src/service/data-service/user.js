"use strict";
const bcrypt = require(`bcrypt`);
const saltRounds = 10;

class UserService {
  constructor(dataBase, logger) {
    const { sequelize, models } = dataBase;
    const { User } = models;
    (this._database = dataBase), (this._models = models);
    this._logger = logger;
  }
  async add({ firstName, lastName, email, password, avatar }) {
    try {
      const { User } = this._models;
      const hash = await bcrypt.hash(password, saltRounds);
      const lastId = await User.findAll({
        limit: 1,
        order: [["id", "DESC"]],
        attributes: [`id`],
      });
      const newId = Number.parseInt(lastId[0]["dataValues"]["id"], 10) + 1;

      const newUser = await User.create({
        id: newId,
        firstName,
        lastName,
        email,
        password: hash,
        avatar,
      });
      return newUser;
    } catch (error) {
      this._logger.error(`Can't create new user. Error: ${error.message}`);
      return false;
    }
  }
  async isExists(email) {
    const { User } = this._models;
    const userEmail = email.trim();
    try {
      const user = await User.findOne({
        where: {
          email: userEmail,
        },
      });
      return user;
    } catch (error) {
      this._logger.error(
        `Can't check existence of user. Error: ${error.message}`
      );

      return null;
    }
  }
  async checkUser(user, password) {
    try {
      const match = await bcrypt.compare(password, user.dataValues.password);

      return match;
    } catch (error) {
      this._logger.error(`Can't autheticate user. Error: ${error.message}`);

      return null;
    }
  }

  async checkRights(user_id, offer_id) {
    const { Offer } = this._models;
    try {
      const match = await Offer.findByPk(offer_id);

      return match.dataValues.userId === user_id;
    } catch (error) {
      this._logger.error(
        `Can't check if user have access. Error: ${error.message}`
      );

      return null;
    }
  }
}

module.exports = UserService;
