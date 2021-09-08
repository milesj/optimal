process.env.PACKEMON_FORMAT = 'mjs';

const { createRootConfig } = require('packemon/babel');

module.exports = createRootConfig();
