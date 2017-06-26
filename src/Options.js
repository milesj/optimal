/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Builder from './Builder';
import { arrayOf } from './ArrayBuilder';
import { bool } from './BoolBuilder';
import { func } from './FuncBuilder';
import { number } from './NumberBuilder';
import { string } from './StringBuilder';
import isObject from './isObject';

import type { Factory, Blueprint } from './types';

export function buildAndCheckOptions(
  baseOptions: Object,
  blueprint: Blueprint,
  parentPath: string = '',
) {
  const unknownOptions = { ...baseOptions };
  const options = {};

  // Validate using the blueprint
  Object.keys(blueprint).forEach((key) => {
    const builder = blueprint[key];
    const value = baseOptions[key];
    const path = parentPath ? `${parentPath}.${key}` : '';

    // Run validation checks
    if (builder instanceof Builder) {
      options[key] = builder.runChecks(path, value);

    // Builder is a plain object, so let's recursively try again
    } else if (isObject(builder)) {
      options[key] = buildAndCheckOptions(value, builder, path);

    // Oops
    } else {
      throw new Error('Unknown blueprint option. Must be a builder or plain object.');
    }

    // Delete the prop and mark it as known
    delete unknownOptions[key];
  });

  // Throw errors for unknown options
  Object.keys(unknownOptions).forEach((key) => {
    throw new Error(`Unknown option ${parentPath ? `${parentPath}.${key}` : key}.`);
  });

  return options;
}

export default class Options {
  constructor(baseOptions: Object, factory: Factory) {
    if (!isObject(baseOptions)) {
      throw new TypeError(`Options require a plain object, found ${typeof baseOptions}.`);

    } else if (typeof factory !== 'function') {
      throw new TypeError('An options factory function is required.');
    }

    // Generate the options blueprint based on the builders provided by the factory,
    // and run validation checks on each property and value recursively
    const options = buildAndCheckOptions(baseOptions, factory({
      arrayOf,
      bool,
      func,
      number,
      string,
    }));

    // Since there are no class properties or methods on Options,
    // we can mix the plain options object into the class
    Object.keys(options).forEach((key) => {
      // $FlowIgnore
      this[key] = options[key];
    });
  }
}
