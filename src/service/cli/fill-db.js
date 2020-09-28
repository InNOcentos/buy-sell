"use strict";

const chalk = require(`chalk`);

const dataBase = require(`../data-base`);
const { fillDataBase } = require(`../data-base/fill-data-base`);
const {
  createUsers,
  createCategories,
  createOffers,
  createOffersCategories,
  createComments,
  flattenOffersCategories,
} = require(`./utils`);
const { USERS_COUNT, OffersCount } = require(`./constants`);
const { ExitCode } = require(`../../constants`);

module.exports = {
  name: `--fill-db`,
  async run(args) {
    const { sequelize } = dataBase;
    const [rawCount] = args;

    const count = Number.parseInt(rawCount, 10) || OffersCount.DEFAULT;

    if (count > OffersCount.MAX) {
      console.error(chalk.red(`No more than ${OffersCount.MAX} offers.`));

      process.exit(ExitCode.error);
    }

    if (count < 0) {
      console.error(chalk.red(`Cant create ${count} offers.`));
      console.log(chalk.red(error.message));
      process.exit(ExitCode.error);
    }

    try {
      console.info(chalk.green(`Trying to connect to the database`));

      const result = await sequelize.sync({force: true});

      console.info(
        chalk.green(
          `Successfully connected to ${result.config.database} database`
        )
      );
    } catch (error) {
      console.error(chalk.red(`Can't connect to database. Error: ${error}`));

      process.exit(ExitCode.error);
    }

    try {
      const users = createUsers(USERS_COUNT);
      const categories = await createCategories();
      const offers = await createOffers(count, users);
      const comments = await createComments(users, offers);
      const offersCategories = await flattenOffersCategories(
        createOffersCategories(offers, categories)
      );

      await fillDataBase({
        dataBase,
        mocks: {
          users,
          categories,
          offers,
          comments,
          offersCategories,
        },
      });

      sequelize.close();
    } catch (error) {
      console.log(chalk.red(`Can't fill database. Error: ${error}`));
    }

    console.info(chalk.green(`Database successfully filled.`));
  },
};
