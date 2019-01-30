/**
 * @copyright   2017-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Builder from './Builder';
import ArrayBuilder, { ArrayOf } from './ArrayBuilder';
import ObjectBuilder, { ObjectOf } from './ObjectBuilder';

// prettier-ignore
export type Blueprint<Struct extends object> = {
  [K in keyof Struct]:
    // Struct[K] extends ArrayBuilder<infer S, infer T> ? ArrayBuilder<S, T> :
    // Struct[K] extends ObjectBuilder<infer S, infer T> ? ObjectBuilder<S, T> :
    Struct[K] extends Builder<infer S, infer T> ? Builder<S, T> :
    Builder<Struct, Struct[K]>
};

// prettier-ignore
export type InferStructure<Struct extends object> = {
  [K in keyof Struct]:
    Struct[K] extends Builder<any, infer T> ? Infer<T> :
    // Struct[K] extends object ? InferStructure<Struct[K]> :
    Struct[K]
};

export type Infer<T> = T extends object ? InferStructure<T> : T;

export type CheckerCallback = (path: string, value: any, ...args: any[]) => void;

export type CustomCallback<Struct extends object = any> = (value: any, struct: Struct) => void;

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
