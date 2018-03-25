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

export enum SupportedType {
  Array = 'array',
  Boolean = 'boolean',
  Custom = 'custom',
  Function = 'function',
  Instance = 'instance',
  Number = 'number',
  Object = 'object',
  Shape = 'shape',
  String = 'string',
  Union = 'union',
  Unknown = 'unknown',
}
