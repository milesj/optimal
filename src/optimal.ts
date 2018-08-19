/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Builder from './Builder';
import isObject from './isObject';
import typeOf from './typeOf';
import { Blueprint, OptimalOptions } from './types';

function buildAndCheck<Struct extends object>(
  struct: Partial<Struct>,
  blueprint: Blueprint<Struct>,
  options: OptimalOptions = {},
  parentPath: string = '',
): Struct {
  // @ts-ignore Allow spread
  const unknownFields = { ...struct };
  const builtStruct: any = {};

  // Validate using the blueprint
  Object.keys(blueprint).forEach(key => {
    const builder = blueprint[key as keyof Blueprint<Struct>];
    const value = struct[key as keyof Struct];
    const path = parentPath ? `${parentPath}.${key}` : key;

    // Run validation checks
    if (builder instanceof Builder) {
      builtStruct[key] = builder.runChecks(path, value, struct, options);

      // Builder is a plain object, so let's recursively try again
    } else if (isObject(builder) && isObject(value)) {
      builtStruct[key] = buildAndCheck(value, builder as any, options, path);

      // Oops
    } else if (process.env.NODE_ENV !== 'production') {
      throw new Error('Unknown blueprint. Must be a builder or plain object.');
    }

    // Delete the prop and mark it as known
    delete unknownFields[key];
  });

  // Handle unknown options
  if (options.unknown) {
    Object.assign(builtStruct, unknownFields);
  } else if (process.env.NODE_ENV !== 'production') {
    const unknownKeys = Object.keys(unknownFields);

    if (unknownKeys.length > 0) {
      throw new Error(`Unknown fields: ${unknownKeys.join(', ')}.`);
    }
  }

  return builtStruct;
}

export default function optimal<Struct extends object>(
  struct: Partial<Struct>,
  blueprint: Blueprint<Struct>,
  options: OptimalOptions = {},
): Struct {
  if (process.env.NODE_ENV !== 'production') {
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
