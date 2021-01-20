/**
 * @copyright   2021, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { array } from './schemas/array';
import { bool } from './schemas/bool';
import { custom } from './schemas/custom';
import { date } from './schemas/date';
import { func } from './schemas/func';
import { instance } from './schemas/instance';
import { number } from './schemas/number';
import { object } from './schemas/object';
import { regex } from './schemas/regex';
import { schema, blueprint } from './schemas/schema';
import { shape } from './schemas/shape';
import { string } from './schemas/string';
import { tuple } from './schemas/tuple';
import { union } from './schemas/union';

export const schemas = {
  array,
  blueprint,
  bool,
  custom,
  date,
  func,
  instance,
  number,
  object,
  regex,
  schema,
  shape,
  string,
  tuple,
  union,
};

export * from './createPredicate';
export * from './createSchema';
export * from './criteria';
export * from './optimal';
export * from './schemas/array';
export * from './schemas/bool';
export * from './schemas/custom';
export * from './schemas/date';
export * from './schemas/func';
export * from './schemas/instance';
export * from './schemas/number';
export * from './schemas/object';
export * from './schemas/regex';
export * from './schemas/schema';
export * from './schemas/shape';
export * from './schemas/string';
export * from './schemas/tuple';
export * from './schemas/union';
export * from './types';
export * from './ValidationError';
