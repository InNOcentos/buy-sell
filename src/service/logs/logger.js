'use strict';

const config = require('../../config');

const logger = require('pino')({
    name: 'REST_API',
    level: config.log_level || 'info'
});

module.exports = {
    logger,
    getLogger(options={}) {
        return logger.child(options);
    }
}