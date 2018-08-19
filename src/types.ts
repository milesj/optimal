/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

/* eslint-disable no-use-before-define, typescript/no-use-before-define */

import Builder from './Builder';

export type Blueprint<Struct extends object> = {
  [K in keyof Struct]: Struct[K] extends object
    ? Blueprint<Struct[K]>
    : Builder<Struct[K] | null, Struct>
};

export type CheckerCallback = (path: string, value: any, ...args: any[]) => void;

export type CustomCallback<Struct extends object> = (value: any, struct: Partial<Struct>) => void;

// Backwards compatability
export interface Struct {
  [key: string]: any;
}

export interface OptimalOptions {
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
