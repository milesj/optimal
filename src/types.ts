import Builder from './Builder';

export type ArrayOf<T> = T[];

export type FuncOf = (...args: unknown[]) => unknown;

export interface ObjectOf<T> {
  [key: string]: T;
}

export type Blueprint<Struct extends object> = { [K in keyof Struct]-?: Builder<Struct[K]> };

// Any is required here since we're literally checking any type of value.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CheckerCallback = (path: string, value: any, ...args: any[]) => void;

export type CustomCallback<T> = (value: T, struct: object) => void;

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
  | 'union'
  | 'unknown';
