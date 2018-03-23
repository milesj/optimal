/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Builder from './Builder';

export interface Blueprint {
  [field: string]: Builder<any> | Blueprint;
}

export type Checker = (path: string, value: any, ...args: any[]) => void;

export type CustomCallback = (value: any, options: OptionsBag) => void;

export interface OptionsBag {
  [key: string]: any;
}

export interface OptionsConfig {
  // eslint-disable-next-line no-restricted-globals
  name?: string;
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
