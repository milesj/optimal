/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Builder from './Builder';

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

export type Checker = (path: string, value: any, ...args: any[]) => void;

export type CustomCallback = (value: any, options: object) => void;

export interface Blueprint {
  [field: string]: Builder<any> | Blueprint;
}

export interface Config {
  // eslint-disable-next-line no-restricted-globals
  name?: string;
  unknown?: boolean;
}

export interface Options {
  [key: string]: any;
}
