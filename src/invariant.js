/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/**
 * Throw an error if the condition is falsy.
 */
export default function invariant(condition: boolean, message: string, path: string = '') {
  if (condition) {
    return;
  }

  if (__DEV__) {
    if (path) {
      throw new Error(`Invalid option "${path}". ${message}`);
    } else {
      throw new Error(message);
    }
  }
}
