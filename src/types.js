/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import type Builder from './Builder';

// Note: Keep in sync with flow definition!

export type SupportedType =
  | 'array'
  | 'boolean'
  | 'function'
  | 'instance'
  | 'number'
  | 'object'
  | 'shape'
  | 'string'
  | 'union'
  | 'custom';

export type Checker = (path: string, value: *, ...args: *[]) => void;

export type CustomCallback = (value: *, options: Object) => void;

export type Blueprint = { [key: string]: Builder<*> | Blueprint };

export type Config = {
  name?: string,
  unknown?: boolean,
};
