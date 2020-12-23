// Any is required here since we're literally checking any type of value.
/* eslint-disable @typescript-eslint/no-explicit-any */

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

export type UnknownObject = Record<string, unknown>;

export type PredicateFactory<T, P> = (defaultValue?: T) => P;

export interface PredicateState<T> {
  defaultValue: T | undefined;
  deprecatedMessage: string;
  never: boolean;
  nullable: boolean;
  required: boolean;
  type: SupportedType;
}

export type CheckerCallback<T> = (
  path: string,
  value: T,
  currentObject: UnknownObject,
  rootObject: UnknownObject,
) => unknown;

export type Checker<T> = (
  state: PredicateState<T>,
  ...args: unknown[]
) => void | CheckerCallback<T>;

// OLD

type TODO<T = any> = any;

export type ArrayOf<T> = T[];

export type FuncOf = (...args: unknown[]) => unknown;

export type ObjectOf<T, Keys extends string = string> = {
  [K in Keys]: T;
};

export type Blueprint<Struct extends object> = { [K in keyof Struct]-?: TODO<Struct[K]> };

export type CustomCallback<T, S extends object = TODO> = (value: T, schema: TODO<S>) => void;

export type DefaultValueFactory<T> = (struct: any) => T;

export type DefaultValue<T> = T | DefaultValueFactory<T> | null;

export type NonUndefined<T> = T extends undefined ? never : T;

export interface OptimalOptions {
  file?: string;
  name?: string;
  prefix?: string;
  unknown?: boolean;
}
