"use strict";

const commentSchema = require(`./comment`);
const newUserSchema = require(`./new-user`);
const offerSchema = require(`./offer`);
const userSchema = require(`./user`);

module.exports = {
    commentSchema,
    newUserSchema,
    offerSchema,
    userSchema
};
