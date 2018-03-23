/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Builder from './Builder';
import isObject from './isObject';
import typeOf from './typeOf';
import { Blueprint, Options, OptimalOptions } from './types';

function buildAndCheckOptions<T extends Options>(
  stagedOptions: Options,
  blueprint: Blueprint,
  options: OptimalOptions = {},
  parentPath: string = '',
): T {
  const unknownOptions: Options = { ...stagedOptions };
  const builtOptions = {} as T;

  // Validate using the blueprint
  Object.keys(blueprint).forEach(key => {
    const builder = blueprint[key];
    const path = parentPath ? `${parentPath}.${key}` : key;

    // Run validation checks
    if (builder instanceof Builder) {
      builtOptions[key] = builder.runChecks(path, stagedOptions[key], stagedOptions, options);

      // Builder is a plain object, so let's recursively try again
    } else if (isObject(builder)) {
      builtOptions[key] = buildAndCheckOptions(stagedOptions[key] || {}, builder, options, path);

      // Oops
    } else if (process.env.NODE_ENV !== 'production') {
      throw new Error('Unknown blueprint option. Must be a builder or plain object.');
    }

    // Delete the prop and mark it as known
    delete unknownOptions[key];
  });

  // Handle unknown options
  if (options.unknown) {
    Object.assign(builtOptions, unknownOptions);
  } else if (process.env.NODE_ENV !== 'production') {
    const unknownKeys = Object.keys(unknownOptions);

    if (unknownKeys.length > 0) {
      throw new Error(`Unknown options: ${unknownKeys.join(', ')}.`);
    }
  }

  return builtOptions;
}

export default function optimal<T extends Options>(
  stagedOptions: Options,
  blueprint: Blueprint,
  options: OptimalOptions = {},
): T {
  if (process.env.NODE_ENV !== 'production') {
    if (!isObject(stagedOptions)) {
      throw new TypeError(`Options require a plain object, found ${typeOf(stagedOptions)}.`);
    } else if (!isObject(options)) {
      throw new TypeError('Optimal options must be a plain object.');
    } else if (!isObject(blueprint)) {
      throw new TypeError('An options blueprint is required.');
    }
  }

  return buildAndCheckOptions(stagedOptions, blueprint, options);
}
