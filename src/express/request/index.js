"use strict";

const { promisify } = require(`util`);

const request = require(`request`);

const getRequestPromise = promisify(request.get);
const postRequestPromise = promisify(request.post);
const putRequestPromise = promisify(request.put);

const requestPromise = {
  get: getRequestPromise,
  post: postRequestPromise,
  put: putRequestPromise,
};

exports.request = requestPromise;
