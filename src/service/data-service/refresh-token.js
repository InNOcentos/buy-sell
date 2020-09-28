"use strict";

class RefreshTokenService {
  constructor(logger) {
    this._refreshTokens = [];
    this._logger = logger;
  }

  async add(token) {
    try {
      this._refreshTokens.push(token);
    } catch (error) {
      this._logger.error(`Can't push refresh token. Error:${error.message}`);
    }
  }

  async find(token) {
    try {
      return this._refreshTokens.find((refreshToken) => refreshToken === token);
    } catch (error) {
      this._logger.error(`Can't find refresh token. Error:${error.message}`);
    }
  }

  async drop(token) {
    try {
      this._refreshTokens = this._refreshTokens.filter(
        (refreshToken) => token !== refreshToken
      );
    } catch (error) {
      this._logger.error(`Can't drop refresh token. Error:${error.message}`);
    }
  }
}

module.exports = RefreshTokenService;
