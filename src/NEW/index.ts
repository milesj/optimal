/**
 * @copyright   2020, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import * as criteria from './criteria';
import createSchema from './createSchema';
import { array } from './schemas/array';
import { bool } from './schemas/bool';
import { instance, date, regex } from './schemas/instance';
import { number } from './schemas/number';
import { object } from './schemas/object';
import { schema, blueprint } from './schemas/schema';
import { string } from './schemas/string';

export { criteria, createSchema };

export const predicates = {
  array,
  blueprint,
  bool,
  // custom,
  date,
  // func,
  instance,
  number,
  object,
  regex,
  schema,
  // shape,
  string,
  // tuple,
  // union,
};

export * from './schemas/array';
export * from './schemas/bool';
export * from './schemas/instance';
export * from './schemas/number';
export * from './schemas/schema';
export * from './schemas/string';
export * from './schemas/object';
export * from './types';
