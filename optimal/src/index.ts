/**
 * @copyright   2021, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import * as schemas from './schemas';

export type Schemas = typeof schemas;

export { schemas };
export * from './createPredicate';
export * from './createSchema';
export * from './criteria';
export * from './optimal';
export * from './OptimalError';
export * from './schemas/array';
export * from './schemas/blueprint';
export * from './schemas/bool';
export * from './schemas/custom';
export * from './schemas/date';
export * from './schemas/func';
export * from './schemas/instance';
export * from './schemas/lazy';
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
