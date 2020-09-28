"use strict";

class CategoryService {
  constructor(dataBase, logger) {
    const { models } = dataBase;

    this._logger = logger;
    this._dataBase = dataBase;
    this._models = models;
    this._selectOptions = {
      raw: true,
    };
  }

  async findAll() {
    const { Category } = this._models;

    try {
      return await Category.findAll(this._selectOptions);
    } catch (error) {
      this.logger.error(`Can't find categories. Error:${error.message}`);
      return null;
    }
  }
}

module.exports = CategoryService;
