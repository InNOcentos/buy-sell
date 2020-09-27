"use strict";

class OfferService {
  constructor(dataBase) {
    const { sequelize, models } = dataBase;
    const { Category } = models;

    this._dataBase = dataBase;
    this._models = models;
    this._selectOptions = {
      raw: true,
      include: {
        model: Category,
        attributes: [],
        through: {
          attributes: [],
        },
      },
      attributes: [
        `id`,
        `title`,
        [`image`, `picture`],
        `sum`,
        `type`,
        `description`,
        [
          sequelize.fn(`ARRAY_AGG`, sequelize.col(`categories.title`)),
          `category`,
        ],
        `createdDate`,
        `userId`,
      ],
      group: [
        `offer.id`,
        `offer.title`,
        `offer.image`,
        `offer.sum`,
        `offer.type`,
        `offer.description`,
      ],
      order: [[`createdDate`, `DESC`]],
    };
  }

  async findAll({ limit }) {
    const { Offer } = this._models;

    try {
      const [quantity, offers] = await Promise.all([
        Offer.count(),
        Offer.findAll({
          ...this._selectOptions,
          limit,
          subQuery: false,
        }),
      ]);

      return {
        offers,
        quantity,
      };
    } catch (error) {
      console.error(`Can't findAll offers. Error: ${error}`);

      return [];
    }
  }

  async findAllByUser({ offset, limit, id }) {
    const { Offer } = this._models;

    try {
      const [quantity, offers] = await Promise.all([
        Offer.count({where: {
          userId: id,
        },}),
        Offer.findAll({
          ...this._selectOptions,
          offset,
          limit,
          subQuery: false,
          where: {
            userId: id,
          },
        }),
      ]);

      return {
        offers,
        quantity,
      };
    } catch (error) {
      console.error(`Can't findAll offers. Error: ${error}`);

      return [];
    }
  }

  async create({
    categories: categoriesIds,
    description,
    picture,
    title,
    type,
    sum,
    id,
  }) {
    const { sequelize } = this._dataBase;
    const { Offer, Category, User } = this._models;

    try {
      const user = await User.findByPk(id);
      const lastId = await Offer.findAll({
        limit: 1,
        order: [["id", "DESC"]],
        attributes: [`id`],
      });
      const newId = Number.parseInt(lastId[0]["dataValues"]["id"], 10) + 1;
      const newOffer = await user.createOffer({
        id: newId,
        title,
        image: picture,
        sum,
        type,
        description,
      });

      const categories = await Category.findAll({
        where: {
          id: {
            [sequelize.Sequelize.Op.or]: categoriesIds,
          },
        },
      });

      await newOffer.setCategories(categories);

      return await Offer.findByPk(newOffer.id, this._selectOptions);
    } catch (error) {
      console.error(`Can't create offer. Error: ${error.message}`);

      return null;
    }
  }

  async isExists(id) {
    const { Offer } = this._models;
    const offerId = Number.parseInt(id, 10);
    try {
      const offer = await Offer.findByPk(offerId);

      return !!offer;
    } catch (error) {
      console.error(`Can't check existence of offer. Error: ${error}`);

      return false;
    }
  }

  async findById(id) {
    const { Offer, Category, User } = this._models;
    const offerId = Number.parseInt(id, 10);

    try {
      const offer = await Offer.findByPk(offerId, this._selectOptions);
      const user = await User.findByPk(offer.userId, {
        attributes: [`firstName`, `lastName`, `email`, `avatar`],
      });

      const categoriesIds = await Offer.findByPk(offerId, {
        include: {
          model: Category,
          attributes: [`id`],
        },
        attributes: [],
      });
      return { offer, user, categoriesIds };
    } catch (error) {
      console.error(`Can't find offer. Error: ${error}`);

      return null;
    }
  }

  async update({
    id,
    category: categoriesIds,
    description,
    picture,
    title,
    type,
    sum,
  }) {
    const { sequelize } = this._dataBase;
    const { Offer, Category } = this._models;

    try {
      const [updatedRows] = await Offer.update(
        {
          title,
          image: picture,
          sum,
          type,
          description,
        },
        {
          where: {
            id,
          },
        }
      );

      if (!updatedRows) {
        return null;
      }

      const updatedOffer = await Offer.findByPk(id);

      const categories = await Category.findAll({
        where: {
          id: {
            [sequelize.Sequelize.Op.or]: categoriesIds,
          },
        },
      });

      await updatedOffer.setCategories(categories);

      return await Offer.findByPk(updatedOffer.id, this._selectOptions);
    } catch (error) {
      console.error(`Can't update offer. Error: ${error}`);

      return null;
    }
  }

  async delete(id) {
    const { Offer } = this._models;

    try {
      const deletedOffer = await Offer.findByPk(id, this._selectOptions);
      const deletedRows = await Offer.destroy({
        returning: true,
        where: {
          id,
        },
        ...this._selectOptions,
      });

      if (!deletedRows) {
        return null;
      }

      return deletedOffer;
    } catch (error) {
      console.error(`Can't delete offer. Error: ${error}`);

      return null;
    }
  }

  async findAllByTitle(title) {
    const { sequelize } = this._dataBase;
    const { Offer } = this._models;

    try {
      return await Offer.findAll({
        ...this._selectOptions,
        where: {
          title: {
            [sequelize.Sequelize.Op.iLike]: `%${title}%`,
          },
        },
      });
    } catch (error) {
      console.error(`Can't find offers with title: ${title}. Error: ${error}`);

      return null;
    }
  }

  async findAllByCategory(categoryId) {
    const { Offer, Category } = this._models;
    /* const {sequelize} = this._dataBase */
    const CategoryId = Number.parseInt(categoryId, 10);

    try {
      const offers = await Offer.findAll({
        attributes: [
          `id`,
          `title`,
          [`image`, `picture`],
          `sum`,
          `type`,
          `description`,
        ],
        include: {
          model: Category,
          as: "categories",
          through: "offers_categories",
          where: {
            id: CategoryId,
          },
        },
      });
      /* 
     /*  const offersCategories = await Offer.findAll({
        ...this._selectOptions,
        attributes: [
          `id`,
          [
            sequelize.fn(`ARRAY_AGG`, sequelize.col(`categories.title`)),
            `category`,
          ],
        ],
      }) */

      return await offers;
    } catch (error) {
      console.error(`Can't find offers. Error: ${error}`);

      return null;
    }
  }
}

module.exports = OfferService;
