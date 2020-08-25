'use strict';

const chalk = require(`chalk`);
const express = require('express');
const {HttpCode,API_PREFIX} = require(`../../constants`);
const routes = require(`../api`);
const getMockData = require(`../lib/get-mock-data`);
const {
  getLogger
} = require(`../logs/logger`);
const logger = getLogger();

const app = express();
const DEFAULT_PORT = 3000;

app.use(express.json());
app.use(API_PREFIX, routes);

app.use((req, res) => {
  res.status(HttpCode.NOT_FOUND).send(`Not found`)
  logger.error(`End request with error ${res.statusCode}`);
});

module.exports = {
  name: `--server`,
  async run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;
    try {
      await getMockData();

      app.listen(port, (err) => {
        if (err) {
          return logger.error(`Server can't start. Error: ${err}`);
        }

        return logger.info(`server start on ${port}`);
      });
    } catch (err) {
      logger.error(`An error has occurred. Error: ${err.message}`);
      process.exit(1);
    }
  }
}
