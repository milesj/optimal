/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Builder from './Builder';
import isObject from './isObject';
import typeOf from './typeOf';
import { Blueprint, Config, Options } from './types';

function buildAndCheckOptions<T extends Options>(
  baseOptions: Options,
  blueprint: Blueprint,
  config: Config = {},
  parentPath: string = '',
): T {
  const unknownOptions: Options = { ...baseOptions };
  const options = {} as T;

  // Validate using the blueprint
  Object.keys(blueprint).forEach(key => {
    const builder = blueprint[key];
    const path = parentPath ? `${parentPath}.${key}` : key;

    // Run validation checks
    if (builder instanceof Builder) {
      options[key] = builder.runChecks(path, baseOptions[key], baseOptions, config);

      // Builder is a plain object, so let's recursively try again
    } else if (isObject(builder)) {
      options[key] = buildAndCheckOptions(baseOptions[key] || {}, builder, config, path);

      // Oops
    } else if (process.env.NODE_ENV !== 'production') {
      throw new Error('Unknown blueprint option. Must be a builder or plain object.');
    }

    // Delete the prop and mark it as known
    delete unknownOptions[key];
  });

  // Handle unknown options
  if (config.unknown) {
    Object.assign(options, unknownOptions);
  } else if (process.env.NODE_ENV !== 'production') {
    const unknownKeys = Object.keys(unknownOptions);

    if (unknownKeys.length > 0) {
      throw new Error(`Unknown options: ${unknownKeys.join(', ')}.`);
    }
  }

  return options;
}

export default function parseOptions<T extends Options>(
  options: Options,
  blueprint: Blueprint,
  config: Config = {},
): T {
  if (process.env.NODE_ENV !== 'production') {
    if (!isObject(options)) {
      throw new TypeError(`Options require a plain object, found ${typeOf(options)}.`);
    } else if (!isObject(config)) {
      throw new TypeError('Option configuration must be a plain object.');
    } else if (!isObject(blueprint)) {
      throw new TypeError('An options blueprint is required.');
    }
  }

  return buildAndCheckOptions(options, blueprint, config);
}
