/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/**
 * Return true if the value is a non-empty string
 */
export default function isString(value: *): boolean {
  return (typeof value === 'string' && value !== '');
}
