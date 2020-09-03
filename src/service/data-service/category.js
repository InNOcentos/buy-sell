'use strict';

class CategoryService {
  constructor(dataBase) {
    const {models} = dataBase;

    this._dataBase = dataBase;
    this._models = models;
    this._selectOptions = {
      raw: true,
    };
  }

  async findAll() {
    const {Category} = this._models;

    try {
      return await Category.findAll(this._selectOptions);
    } catch (error) {
      console.error(`Can't find categories. Error: ${ error }`);

      return null;
    }
  }
}

module.exports = CategoryService;
