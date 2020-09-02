'use strict';

const help = require(`./help`);
const generate = require(`./generate`);
const version = require(`./version`);
const server = require(`./server`);
const fillDB = require(`./fill-db`);

const Cli = {
  [generate.name]: generate,
  [help.name]: help,
  [version.name]: version,
  [fillDB.name]: fillDB,
  [server.name]: server,
};

module.exports = {
  Cli,
};
