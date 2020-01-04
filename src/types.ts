// Any is required here since we're literally checking any type of value.
/* eslint-disable @typescript-eslint/no-explicit-any */

import Predicate from './Predicate';
import Schema from './Schema';

export type ArrayOf<T> = T[];

export type FuncOf = (...args: unknown[]) => unknown;

export interface ObjectOf<T> {
  [key: string]: T;
}

export type Blueprint<Struct extends object> = { [K in keyof Struct]-?: Predicate<Struct[K]> };

export type CheckerCallback<T = any> = (path: string, value: T) => unknown;

export type CustomCallback<T, S extends object = object> = (value: T, schema: Schema<S>) => void;

export type DefaultValueFactory<T> = (struct: any) => T;

export type DefaultValue<T> = T | DefaultValueFactory<T>;

export interface OptimalOptions {
  file?: string;
  name?: string;
  prefix?: string;
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
  | 'tuple'
  | 'union'
  | 'unknown';
