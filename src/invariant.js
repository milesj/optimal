/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/**
 * Throw an error if the condition is falsy.
 */
export default function invariant(condition: boolean, path: string, message: string) {
  if (!condition) {
    throw new Error(`Invalid option "${path}". ${message}`);
  }
}
