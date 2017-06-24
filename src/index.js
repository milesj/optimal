/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-env node */
/* eslint-disable global-require */

let Options;

if (process.env.NODE_ENV === 'production') {
  Options = require('./PlainOptions').default;
} else {
  Options = require('./Options').default;
}

module.exports = Options;
