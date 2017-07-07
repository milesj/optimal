/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Builder from './Builder';
import { arrayOf } from './ArrayBuilder';
import { bool } from './BoolBuilder';
import { custom } from './CustomBuilder';
import { func } from './FuncBuilder';
import { instanceOf, date, regex } from './InstanceBuilder';
import { number } from './NumberBuilder';
import { objectOf } from './ObjectBuilder';
import { shape } from './ShapeBuilder';
import { string } from './StringBuilder';
import { union } from './UnionBuilder';
import isObject from './isObject';
import typeOf from './typeOf';

import type { Factory, Blueprint, Config } from './types';

function buildAndCheckOptions(
  baseOptions: Object,
  blueprint: Blueprint,
  config: Config = {},
  parentPath: string = '',
) {
  const unknownOptions = { ...baseOptions };
  const options = {};

  // Validate using the blueprint
  Object.keys(blueprint).forEach((key) => {
    const builder = blueprint[key];
    const value = baseOptions[key];
    const path = parentPath ? `${parentPath}.${key}` : key;

    // Run validation checks
    if (builder instanceof Builder) {
      options[key] = builder.runChecks(path, value, config);

    // Builder is a plain object, so let's recursively try again
    } else if (isObject(builder)) {
      options[key] = buildAndCheckOptions(value || {}, builder, config, path);

    // Oops
    } else if (__DEV__) {
      throw new Error('Unknown blueprint option. Must be a builder or plain object.');
    }

    // Delete the prop and mark it as known
    delete unknownOptions[key];
  });

  // Throw errors for unknown options
  if (__DEV__) {
    const unknownKeys = Object.keys(unknownOptions);

    if (!config.unknown && unknownKeys.length > 0) {
      throw new Error(`Unknown options ${unknownKeys.join(', ')}.`);
    }
  }

  return options;
}

export default function Options(baseOptions: Object, factory: Factory, config: Config = {}) {
  if (__DEV__) {
    if (!isObject(baseOptions)) {
      throw new TypeError(`Options require a plain object, found ${typeOf(baseOptions)}.`);

    } else if (typeof factory !== 'function') {
      throw new TypeError('An options factory function is required.');
    }
  }

  // Generate the options blueprint based on the builders provided by the factory,
  // and run validation checks on each property and value recursively.
  return buildAndCheckOptions(baseOptions, factory({
    arrayOf,
    bool,
    custom,
    date,
    func,
    instanceOf,
    number,
    objectOf,
    regex,
    shape,
    string,
    union,
  }), config);
}
