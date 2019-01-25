/**
 * @copyright   2017-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Builder from './Builder';

// prettier-ignore
export type Blueprint<Struct extends object> = {
  [K in keyof Struct]:
    Struct[K] extends object ? Blueprint<Struct[K]> :
    Struct[K] extends Builder<any, Struct> ? Struct[K] :
    Builder<Struct[K], Struct>
};

// prettier-ignore
export type InferStructure<Struct extends object> = {
  [K in keyof Struct]:
    Struct[K] extends object ? InferStructure<Struct[K]> :
    Struct[K] extends Builder<infer U, any> ? Infer<U> :
    Struct[K]
};

export type Infer<T> = T extends object ? InferStructure<T> : T;

export type CheckerCallback = (path: string, value: any, ...args: any[]) => void;

export type CustomCallback<Struct extends object> = (value: any, struct: Struct) => void;

export interface OptimalOptions {
  file?: string;
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
