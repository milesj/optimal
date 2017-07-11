/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Builder from './Builder';
import { array } from './ArrayBuilder';
import { bool } from './BoolBuilder';
import { custom } from './CustomBuilder';
import { func } from './FuncBuilder';
import { instance, date, regex } from './InstanceBuilder';
import { number } from './NumberBuilder';
import { object } from './ObjectBuilder';
import { shape } from './ShapeBuilder';
import { string } from './StringBuilder';
import { union } from './UnionBuilder';
import isObject from './isObject';
import typeOf from './typeOf';

import type { Factory, Blueprint, Config } from './types';

function buildAndCheckOptions(
  baseOptions: Object,
  blueprint: Blueprint,
  config?: Config = {},
  parentPath?: string = '',
): Object {
  const unknownOptions = { ...baseOptions };
  const options = {};

  // Validate using the blueprint
  Object.keys(blueprint).forEach((key) => {
    const builder = blueprint[key];
    const path = parentPath ? `${parentPath}.${key}` : key;

    // Run validation checks
    if (builder instanceof Builder) {
      options[key] = builder.runChecks(path, baseOptions[key], baseOptions, config);

    // Builder is a plain object, so let's recursively try again
    } else if (isObject(builder)) {
      options[key] = buildAndCheckOptions(baseOptions[key] || {}, builder, config, path);

    // Oops
    } else if (__DEV__) {
      throw new Error('Unknown blueprint option. Must be a builder or plain object.');
    }

    // Delete the prop and mark it as known
    delete unknownOptions[key];
  });

  // Handle unknown options
  if (config.unknown) {
    Object.assign(options, unknownOptions);

  } else if (__DEV__) {
    const unknownKeys = Object.keys(unknownOptions);

    if (unknownKeys.length > 0) {
      throw new Error(`Unknown options: ${unknownKeys.join(', ')}.`);
    }
  }

  return options;
}

export default function Options(
  baseOptions: Object,
  factory: Factory,
  config?: Config = {},
): Object {
  if (__DEV__) {
    if (!isObject(baseOptions)) {
      throw new TypeError(`Options require a plain object, found ${typeOf(baseOptions)}.`);

    } else if (!isObject(config)) {
      throw new TypeError('Option configuration must be a plain object.');

    } else if (typeof factory !== 'function') {
      throw new TypeError('An options factory function is required.');
    }
  }

  // Generate the options blueprint based on the builders provided by the factory,
  // and run validation checks on each property and value recursively.
  return buildAndCheckOptions(baseOptions, factory({
    array,
    bool,
    custom,
    date,
    func,
    instance,
    number,
    object,
    regex,
    shape,
    string,
    union,
  }), config);
}
