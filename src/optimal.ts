/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Builder from './Builder';
import isObject from './isObject';
import typeOf from './typeOf';
import { Blueprint, OptimalOptions, Struct } from './types';

function buildAndCheck<T extends Struct>(
  struct: Struct,
  blueprint: Blueprint,
  options: OptimalOptions = {},
  parentPath: string = '',
): T {
  const unknownFields: Struct = { ...struct };
  const builtStruct = {} as T;

  // Validate using the blueprint
  Object.keys(blueprint).forEach(key => {
    const builder = blueprint[key];
    const path = parentPath ? `${parentPath}.${key}` : key;

    // Run validation checks
    if (builder instanceof Builder) {
      builtStruct[key] = builder.runChecks(path, struct[key], struct, options);

      // Builder is a plain object, so let's recursively try again
    } else if (isObject(builder)) {
      builtStruct[key] = buildAndCheck(struct[key] || {}, builder, options, path);

      // Oops
    } else if (__DEV__) {
      throw new Error('Unknown blueprint. Must be a builder or plain object.');
    }

    // Delete the prop and mark it as known
    delete unknownFields[key];
  });

  // Handle unknown options
  if (options.unknown) {
    Object.assign(builtStruct, unknownFields);
  } else if (__DEV__) {
    const unknownKeys = Object.keys(unknownFields);

    if (unknownKeys.length > 0) {
      throw new Error(`Unknown fields: ${unknownKeys.join(', ')}.`);
    }
  }

  return builtStruct;
}

export default function optimal<T extends Struct>(
  struct: Struct,
  blueprint: Blueprint,
  options: OptimalOptions = {},
): T {
  if (__DEV__) {
    if (!isObject(struct)) {
      throw new TypeError(`Optimal requires a plain object, found ${typeOf(struct)}.`);
    } else if (!isObject(options)) {
      throw new TypeError('Optimal options must be a plain object.');
    } else if (!isObject(blueprint)) {
      throw new TypeError('A blueprint is required.');
    }
  }

  return buildAndCheck(struct, blueprint, options);
}
