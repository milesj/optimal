/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Builder from './Builder';

export interface Blueprint {
  [field: string]: Builder<any> | Blueprint;
}

export type Checker = (path: string, value: any, ...args: any[]) => void;

export type CustomCallback = (value: any, options: Options) => void;

export interface Options {
  [key: string]: any;
}

export interface OptimalOptions extends Options {
  name?: string; // eslint-disable-line no-restricted-globals
  unknown?: boolean;
}

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
