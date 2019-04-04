import Builder from './Builder';

export type ArrayOf<T> = T[];

export type FuncOf = (...args: unknown[]) => unknown;

export interface ObjectOf<T> {
  [key: string]: T;
}

export type Blueprint<Struct extends object> = { [K in keyof Struct]-?: Builder<Struct[K]> };

export type CheckerCallback = (path: string, value: any, ...args: any[]) => void;

export type CustomCallback<T> = (value: T, struct: object) => void;

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
