/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Builder from './Builder';

export interface Blueprint {
  [field: string]: Builder<any> | Blueprint;
}

export type CheckerCallback = (path: string, value: any, ...args: any[]) => void;

export type CustomCallback = (value: any, struct: Struct) => void;

export interface Struct<T = any> {
  [key: string]: T;
}

export interface OptimalOptions extends Struct {
  name?: string;
  unknown?: boolean;
}

export type SupportedType =
  | 'array'
  | 'boolean'
  | 'custom'
  | 'function'
  | 'instance'
  | 'number'
  | 'object'
  | 'shape'
  | 'string'
  | 'union'
  | 'unknown';
