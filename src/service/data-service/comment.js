'use strict';

class CommentService {
  constructor(dataBase) {
    const {models} = dataBase;
    const {User} = models;
    this._dataBase = dataBase;
    this._models = models;
    this._selectOptions = {
      attributes: [
        `id`,
        `message`,
        `createdDate`
      ],
      include: {
        model: User,
        as: 'user',
        attributes: [
          `avatar`,
          `firstName`,
          `lastName`,
        ]
      }
    };
  }

  async findAll(offerId) {
    const {Offer, User} = this._models;

    try {
      const offer = await Offer.findByPk(offerId);
      const comments =  await offer.getComments(this._selectOptions);
      return comments;
    } catch (error) {
      console.error(`Can't find comments for offer with id ${ offerId }. Error: ${ error }`);

      return null;
    }
  }

  async create(offerId, text) {
    const {Offer, Comment, User} = this._models;

    try {
      const offer = await Offer.findByPk(offerId);
      const user = await User.findByPk(1,{
        attributes: [
          `avatar`,
          `firstName`,
          `lastName`,
        ]
      });
      const lastId = await Comment.findAll({
        limit: 1,
        order: [ [ 'id', 'DESC' ]],
        attributes: [
          `id`
        ]
      });
      const newId = Number.parseInt(lastId[0]['dataValues']['id'], 10) + 1;
      const comment = await offer.createComment({
        message: text,
        id: newId,
        userId: 1
      });

      return await Comment.findByPk(comment.id,this._selectOptions);
    } catch (error) {
      console.error(`Can't create comment for offer with id ${ offerId }. Error: ${ error }`);

      return null;
    }
  }

  async delete(id) {
    const {Comment} = this._models;

    try {
      const deletedComment = await Comment.findByPk(id,this._selectOptions);
      const deletedRows = await Comment.destroy({
        where: {
          id,
        },
        ...this._selectOptions
      });

      if (!deletedRows) {
        return null;
      }

      return deletedComment;
    } catch (error) {
      console.error(`Can't delete comment with id: ${ id }. Error: ${ error }`);

      return null;
    }
  }
}

module.exports = CommentService;
