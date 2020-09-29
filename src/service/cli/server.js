"use strict";

const express = require("express");

const { HttpCode, API_PREFIX,ExitCode } = require(`../../constants`);
const routes = require(`../api`);
const { getLogger } = require(`../logs/logger`);
const logger = getLogger();
const {sequelize} = require('../data-base');

const app = express();
const DEFAULT_PORT = 3000;

app.use(express.json());

app.use(API_PREFIX, routes);

app.use((req, res) => {
  res.status(HttpCode.NOT_FOUND).send(`Not found`);
  logger.error(`End request with error ${res.statusCode}`);
});

module.exports = {
  name: `--server`,
  async run(args) {
    const [customPort] = args;
    const port = process.env.PORT || Number.parseInt(customPort, 10) || DEFAULT_PORT;

    try {
      await sequelize.sync();
    } catch (err) {
      logger.error(`An error has occurred. Error: ${err.message}`);
      process.exit(ExitCode.error);
    }

    try {
      app.listen(port, (err) => {
        if (err) {
          return logger.error(`Server can't start. Error: ${err}`);
        }
        return logger.info(`Server start on ${port}`);
      });
    } catch (err) {
      logger.error(`An error has occurred. Error: ${err.message}`);
      process.exit(ExitCode.error);
    }
  },
};
