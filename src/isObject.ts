/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

/**
 * Return true if the value is a plain object.
 */
export default function isObject(value: any): value is object {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
