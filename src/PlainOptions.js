/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

export default class Options {
  constructor(options: Object) {
    Object.keys(options).forEach((key) => {
      // $FlowIgnore
      this[key] = options[key];
    });
  }
}
