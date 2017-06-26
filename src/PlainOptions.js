/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/**
 * When in production, we want to avoid all the unnecessary overhead.
 * We can achieve this by "faking" a class using a function,
 * and simply have the function return the options object as is.
 */
export default function Options(options: Object) {
  return options;
}
